import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
export declare class RatingsService {
    private ratingsRepository;
    constructor(ratingsRepository: Repository<Rating>);
    create(createRatingDto: CreateRatingDto, userId: string): Promise<Rating>;
    update(id: string, createRatingDto: CreateRatingDto, userId: string): Promise<Rating>;
    findByStore(storeId: string): Promise<Rating[]>;
    findByUser(userId: string): Promise<Rating[]>;
    getStoreAverageRating(storeId: string): Promise<{
        averageRating: number;
        totalRatings: number;
    }>;
    getStoreOwnerDashboard(ownerId: string): Promise<any>;
}
