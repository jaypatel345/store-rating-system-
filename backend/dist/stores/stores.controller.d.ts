import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
export declare class StoresController {
    private storesService;
    constructor(storesService: StoresService);
    create(createStoreDto: CreateStoreDto): Promise<import("./entities/store.entity").Store>;
    findAll(name?: string, address?: string, sortBy?: string, sortOrder?: 'ASC' | 'DESC', user?: any): Promise<any[]>;
    findOne(id: string, user?: any): Promise<any>;
}
