import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserRole } from './entities/user.entity';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(name?: string, email?: string, address?: string, role?: UserRole, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<import("./entities/user.entity").User[]>;
    getStats(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    updatePassword(user: any, updatePasswordDto: UpdatePasswordDto): Promise<void>;
}
