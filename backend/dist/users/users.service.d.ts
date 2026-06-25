import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(filters?: {
        name?: string;
        email?: string;
        address?: string;
        role?: UserRole;
    }, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<User[]>;
    findOne(id: string): Promise<User>;
    updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<void>;
    getStats(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
}
