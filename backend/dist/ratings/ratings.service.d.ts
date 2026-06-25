import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { StoresService } from '../stores/stores.service';
export declare class RatingsService {
    private ratingsRepository;
    private storesService;
    constructor(ratingsRepository: Repository<Rating>, storesService: StoresService);
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
