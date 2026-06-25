import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: '1',
    name: 'Test User Name That Is At Least Twenty Characters Long',
    email: 'test@example.com',
    password: 'hashedPassword',
    address: '123 Test Street',
    role: UserRole.USER,
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User Name That Is At Least Twenty Characters Long',
        email: 'test@example.com',
        password: 'Password123!',
        address: '123 Test Street',
        role: UserRole.USER,
      };

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(mockUser);
      repository.save.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

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
      const createUserDto: CreateUserDto = {
        name: 'Test User Name That Is At Least Twenty Characters Long',
        email: 'test@example.com',
        password: 'Password123!',
        address: '123 Test Street',
        role: UserRole.USER,
      };

      repository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockUser]),
      };
      repository.createQueryBuilder.mockReturnValue(queryBuilder as any);

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
      repository.createQueryBuilder.mockReturnValue(queryBuilder as any);

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

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: 'oldPassword123!',
        newPassword: 'newPassword123!',
      };

      repository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      repository.save.mockResolvedValue(mockUser);

      await service.updatePassword('1', updatePasswordDto);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        updatePasswordDto.currentPassword,
        mockUser.password,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(updatePasswordDto.newPassword, 10);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if current password is incorrect', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword123!',
      };

      repository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.updatePassword('1', updatePasswordDto)).rejects.toThrow(
        ConflictException,
      );
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
      repository.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await service.getStats();

      expect(result).toEqual({
        totalUsers: 10,
        totalStores: 5,
        totalRatings: 20,
      });
    });
  });
});
