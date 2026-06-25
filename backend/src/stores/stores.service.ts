import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storesRepository.create(createStoreDto);
    return this.storesRepository.save(store);
  }

  async findAll(filters?: {
    name?: string;
    address?: string;
  }, sortBy?: string, sortOrder: 'ASC' | 'DESC' = 'ASC'): Promise<Store[]> {
    const queryBuilder = this.storesRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.owner', 'owner')
      .leftJoinAndSelect('store.ratings', 'ratings');

    if (filters?.name) {
      queryBuilder.andWhere('store.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters?.address) {
      queryBuilder.andWhere('store.address LIKE :address', { address: `%${filters.address}%` });
    }

    if (sortBy) {
      const validSortFields = ['name', 'email', 'address', 'createdAt'];
      if (validSortFields.includes(sortBy)) {
        queryBuilder.orderBy(`store.${sortBy}`, sortOrder);
      }
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storesRepository.findOne({
      where: { id },
      relations: ['owner', 'ratings', 'ratings.user'],
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async getStoreWithRating(storeId: string, userId: string): Promise<any> {
    const store = await this.storesRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.owner', 'owner')
      .leftJoin('store.ratings', 'ratings')
      .leftJoin('ratings.user', 'ratingUser')
      .addSelect([
        'ratings.id',
        'ratings.rating',
        'ratings.userId',
        'ratingUser.id',
        'ratingUser.name',
        'ratingUser.email',
      ])
      .where('store.id = :storeId', { storeId })
      .getOne();

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const userRating = store.ratings.find((r) => r.userId === userId);
    const overallRating =
      store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : 0;

    return {
      ...store,
      overallRating: parseFloat(overallRating.toFixed(2)),
      userRating: userRating ? userRating.rating : null,
    };
  }

  async getStoresForUser(userId: string, filters?: {
    name?: string;
    address?: string;
  }): Promise<any[]> {
    const stores = await this.findAll(filters);

    return Promise.all(
      stores.map(async (store) => {
        const overallRating =
          store.ratings.length > 0
            ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
            : 0;
        const userRating = store.ratings.find((r) => r.userId === userId);

        return {
          id: store.id,
          name: store.name,
          address: store.address,
          email: store.email,
          overallRating: parseFloat(overallRating.toFixed(2)),
          userRating: userRating ? userRating.rating : null,
        };
      }),
    );
  }

  async findByOwner(ownerId: string): Promise<Store[]> {
    return this.storesRepository.find({
      where: { ownerId },
      relations: ['ratings', 'ratings.user'],
    });
  }
}
