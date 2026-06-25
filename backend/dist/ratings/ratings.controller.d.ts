import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
export declare class RatingsController {
    private ratingsService;
    constructor(ratingsService: RatingsService);
    create(createRatingDto: CreateRatingDto, user: any): Promise<import("./entities/rating.entity").Rating>;
    update(id: string, createRatingDto: CreateRatingDto, user: any): Promise<import("./entities/rating.entity").Rating>;
    findByStore(storeId: string): Promise<import("./entities/rating.entity").Rating[]>;
    getStoreAverageRating(storeId: string): Promise<{
        averageRating: number;
        totalRatings: number;
    }>;
    getStoreOwnerDashboard(user: any): Promise<any>;
    findByUser(user: any): Promise<import("./entities/rating.entity").Rating[]>;
}
