import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async create(createRatingDto: CreateRatingDto, userId: string): Promise<Rating> {
    const existingRating = await this.ratingsRepository.findOne({
      where: {
        userId,
        storeId: createRatingDto.storeId,
      },
    });

    if (existingRating) {
      throw new ConflictException('You have already rated this store. Use PUT to update your rating.');
    }

    const rating = this.ratingsRepository.create({
      ...createRatingDto,
      userId,
    });

    return this.ratingsRepository.save(rating);
  }

  async update(id: string, createRatingDto: CreateRatingDto, userId: string): Promise<Rating> {
    const rating = await this.ratingsRepository.findOne({
      where: { id },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    if (rating.userId !== userId) {
      throw new ConflictException('You can only update your own ratings');
    }

    rating.rating = createRatingDto.rating;
    return this.ratingsRepository.save(rating);
  }

  async findByStore(storeId: string): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { storeId },
      relations: ['user'],
    });
  }

  async findByUser(userId: string): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { userId },
      relations: ['store'],
    });
  }

  async getStoreAverageRating(storeId: string): Promise<{ averageRating: number; totalRatings: number }> {
    const ratings = await this.ratingsRepository.find({
      where: { storeId },
    });

    if (ratings.length === 0) {
      return { averageRating: 0, totalRatings: 0 };
    }

    const averageRating =
      ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;

    return {
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalRatings: ratings.length,
    };
  }

  async getStoreOwnerDashboard(ownerId: string): Promise<any> {
    const ratings = await this.ratingsRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.store', 'store')
      .leftJoinAndSelect('rating.user', 'user')
      .leftJoin('store.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId })
      .getMany();

    const storeRatings = ratings.reduce((acc, rating) => {
      if (!acc[rating.storeId]) {
        acc[rating.storeId] = {
          storeId: rating.storeId,
          storeName: rating.store.name,
          ratings: [],
        };
      }
      acc[rating.storeId].ratings.push({
        user: {
          id: rating.user.id,
          name: rating.user.name,
          email: rating.user.email,
        },
        rating: rating.rating,
        createdAt: rating.createdAt,
      });
      return acc;
    }, {} as any);

    const result = Object.values(storeRatings).map((store: any) => {
      const averageRating =
        store.ratings.length > 0
          ? store.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / store.ratings.length
          : 0;

      return {
        storeId: store.storeId,
        storeName: store.storeName,
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalRatings: store.ratings.length,
        ratings: store.ratings,
      };
    });

    return result;
  }
}
