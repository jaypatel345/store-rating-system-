"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.usersRepository.save(user);
    }
    async findAll(filters, sortBy, sortOrder = 'ASC') {
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
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['stores', 'ratings'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updatePassword(userId, updatePasswordDto) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(updatePasswordDto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.ConflictException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
        user.password = hashedPassword;
        await this.usersRepository.save(user);
    }
    async getStats() {
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map