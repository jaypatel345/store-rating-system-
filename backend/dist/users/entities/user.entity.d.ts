import { Store } from '../../stores/entities/store.entity';
import { Rating } from '../../ratings/entities/rating.entity';
export declare enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    STORE_OWNER = "STORE_OWNER"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    address: string;
    role: string;
    stores: Store[];
    ratings: Rating[];
    createdAt: Date;
}
