import { User } from '../../users/entities/user.entity';
import { Rating } from '../../ratings/entities/rating.entity';
export declare class Store {
    id: string;
    name: string;
    email: string;
    address: string;
    owner: User;
    ownerId: string;
    ratings: Rating[];
    createdAt: Date;
}
