import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
export declare class StoresService {
    private storesRepository;
    constructor(storesRepository: Repository<Store>);
    create(createStoreDto: CreateStoreDto): Promise<Store>;
    findAll(filters?: {
        name?: string;
        address?: string;
    }, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<Store[]>;
    findOne(id: string): Promise<Store>;
    getStoreWithRating(storeId: string, userId: string): Promise<any>;
    getStoresForUser(userId: string, filters?: {
        name?: string;
        address?: string;
    }): Promise<any[]>;
}
