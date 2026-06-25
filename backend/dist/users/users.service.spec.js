"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const users_service_1 = require("./users.service");
const user_entity_1 = require("./entities/user.entity");
describe('UsersService', () => {
    let service;
    let repository;
    const mockUser = {
        id: '1',
        name: 'Test User Name That Is At Least Twenty Characters Long',
        email: 'test@example.com',
        password: 'hashedPassword',
        address: '123 Test Street',
        role: user_entity_1.UserRole.USER,
        stores: [],
        ratings: [],
        createdAt: new Date(),
    };
    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        count: jest.fn(),
        createQueryBuilder: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User),
                    useValue: mockRepository,
                },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto = {
                name: 'Test User Name That Is At Least Twenty Characters Long',
                email: 'test@example.com',
                password: 'Password123!',
                address: '123 Test Street',
                role: user_entity_1.UserRole.USER,
            };
            repository.findOne.mockResolvedValue(null);
            repository.create.mockReturnValue(mockUser);
            repository.save.mockResolvedValue(mockUser);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            const result = await service.create(createUserDto);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { email: createUserDto.email },
            });
            expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
            expect(repository.create).toHaveBeenCalledWith({
                ...createUserDto,
                password: 'hashedPassword',
            });
            expect(repository.save).toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });
        it('should throw ConflictException if email already exists', async () => {
            const createUserDto = {
                name: 'Test User Name That Is At Least Twenty Characters Long',
                email: 'test@example.com',
                password: 'Password123!',
                address: '123 Test Street',
                role: user_entity_1.UserRole.USER,
            };
            repository.findOne.mockResolvedValue(mockUser);
            await expect(service.create(createUserDto)).rejects.toThrow(common_1.ConflictException);
        });
    });
    describe('findAll', () => {
        it('should return an array of users', async () => {
            const queryBuilder = {
                andWhere: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue([mockUser]),
            };
            repository.createQueryBuilder.mockReturnValue(queryBuilder);
            const result = await service.findAll();
            expect(repository.createQueryBuilder).toHaveBeenCalledWith('user');
            expect(queryBuilder.getMany).toHaveBeenCalled();
            expect(result).toEqual([mockUser]);
        });
        it('should apply filters when provided', async () => {
            const queryBuilder = {
                andWhere: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue([mockUser]),
            };
            repository.createQueryBuilder.mockReturnValue(queryBuilder);
            await service.findAll({ name: 'Test', email: 'test@example.com' });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('user.name LIKE :name', {
                name: '%Test%',
            });
            expect(queryBuilder.andWhere).toHaveBeenCalledWith('user.email LIKE :email', {
                email: '%test@example.com%',
            });
        });
    });
    describe('findOne', () => {
        it('should return a user by id', async () => {
            repository.findOne.mockResolvedValue(mockUser);
            const result = await service.findOne('1');
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
                relations: ['stores', 'ratings'],
            });
            expect(result).toEqual(mockUser);
        });
        it('should throw NotFoundException if user not found', async () => {
            repository.findOne.mockResolvedValue(null);
            await expect(service.findOne('1')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('updatePassword', () => {
        it('should update user password', async () => {
            const updatePasswordDto = {
                currentPassword: 'oldPassword123!',
                newPassword: 'newPassword123!',
            };
            repository.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('newHashedPassword');
            repository.save.mockResolvedValue(mockUser);
            await service.updatePassword('1', updatePasswordDto);
            expect(bcrypt.compare).toHaveBeenCalledWith(updatePasswordDto.currentPassword, mockUser.password);
            expect(bcrypt.hash).toHaveBeenCalledWith(updatePasswordDto.newPassword, 10);
            expect(repository.save).toHaveBeenCalled();
        });
        it('should throw ConflictException if current password is incorrect', async () => {
            const updatePasswordDto = {
                currentPassword: 'wrongPassword',
                newPassword: 'newPassword123!',
            };
            repository.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            await expect(service.updatePassword('1', updatePasswordDto)).rejects.toThrow(common_1.ConflictException);
        });
    });
    describe('getStats', () => {
        it('should return dashboard statistics', async () => {
            repository.count.mockResolvedValue(10);
            const queryBuilder = {
                leftJoin: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                getRawOne: jest.fn()
                    .mockResolvedValueOnce({ count: '5' })
                    .mockResolvedValueOnce({ count: '20' }),
            };
            repository.createQueryBuilder.mockReturnValue(queryBuilder);
            const result = await service.getStats();
            expect(result).toEqual({
                totalUsers: 10,
                totalStores: 5,
                totalRatings: 20,
            });
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map