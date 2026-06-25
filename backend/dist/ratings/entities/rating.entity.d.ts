import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
export declare class Rating {
    id: string;
    rating: number;
    user: User;
    userId: string;
    store: Store;
    storeId: string;
    createdAt: Date;
    updatedAt: Date;
}
