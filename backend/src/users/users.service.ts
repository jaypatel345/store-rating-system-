import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(filters?: {
    name?: string;
    email?: string;
    address?: string;
    role?: UserRole;
  }, sortBy?: string, sortOrder: 'ASC' | 'DESC' = 'ASC'): Promise<User[]> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (filters?.name) {
      queryBuilder.andWhere('user.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters?.email) {
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${filters.email}%` });
    }

    if (filters?.address) {
      queryBuilder.andWhere('user.address LIKE :address', { address: `%${filters.address}%` });
    }

    if (filters?.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }

    if (sortBy) {
      const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
      if (validSortFields.includes(sortBy)) {
        queryBuilder.orderBy(`user.${sortBy}`, sortOrder);
      }
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['stores', 'ratings'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ConflictException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    user.password = hashedPassword;

    await this.usersRepository.save(user);
  }

  async getStats(): Promise<{
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
  }> {
    const totalUsers = await this.usersRepository.count();
    const totalStores = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.stores', 'store')
      .select('COUNT(DISTINCT store.id)', 'count')
      .getRawOne()
      .then((result) => parseInt(result?.count) || 0);
    const totalRatings = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.ratings', 'rating')
      .select('COUNT(DISTINCT rating.id)', 'count')
      .getRawOne()
      .then((result) => parseInt(result?.count) || 0);

    return { totalUsers, totalStores, totalRatings };
  }
}
