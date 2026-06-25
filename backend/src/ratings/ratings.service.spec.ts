import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';

describe('RatingsService', () => {
  let service: RatingsService;
  let repository: jest.Mocked<Repository<Rating>>;

  const mockRating: Rating = {
    id: '1',
    rating: 5,
    userId: 'user1',
    storeId: 'store1',
    user: {} as any,
    store: {} as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingsService,
        {
          provide: getRepositoryToken(Rating),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RatingsService>(RatingsService);
    repository = module.get(getRepositoryToken(Rating));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new rating', async () => {
      const createRatingDto: CreateRatingDto = {
        rating: 5,
        storeId: 'store1',
      };

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(mockRating);
      repository.save.mockResolvedValue(mockRating);

      const result = await service.create(createRatingDto, 'user1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user1', storeId: 'store1' },
      });
      expect(repository.create).toHaveBeenCalledWith({
        ...createRatingDto,
        userId: 'user1',
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockRating);
    });

    it('should throw ConflictException if rating already exists', async () => {
      const createRatingDto: CreateRatingDto = {
        rating: 5,
        storeId: 'store1',
      };

      repository.findOne.mockResolvedValue(mockRating);

      await expect(service.create(createRatingDto, 'user1')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing rating', async () => {
      const createRatingDto: CreateRatingDto = {
        rating: 4,
        storeId: 'store1',
      };

      repository.findOne.mockResolvedValue(mockRating);
      repository.save.mockResolvedValue({ ...mockRating, rating: 4 });

      const result = await service.update('1', createRatingDto, 'user1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.save).toHaveBeenCalled();
      expect(result.rating).toBe(4);
    });

    it('should throw NotFoundException if rating not found', async () => {
      const createRatingDto: CreateRatingDto = {
        rating: 4,
        storeId: 'store1',
      };

      repository.findOne.mockResolvedValue(null);

      await expect(service.update('1', createRatingDto, 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if user is not the owner', async () => {
      const createRatingDto: CreateRatingDto = {
        rating: 4,
        storeId: 'store1',
      };

      repository.findOne.mockResolvedValue({ ...mockRating, userId: 'user2' });

      await expect(service.update('1', createRatingDto, 'user1')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findByStore', () => {
    it('should return ratings for a store', async () => {
      repository.find.mockResolvedValue([mockRating]);

      const result = await service.findByStore('store1');

      expect(repository.find).toHaveBeenCalledWith({
        where: { storeId: 'store1' },
        relations: ['user'],
      });
      expect(result).toEqual([mockRating]);
    });
  });

  describe('findByUser', () => {
    it('should return ratings for a user', async () => {
      repository.find.mockResolvedValue([mockRating]);

      const result = await service.findByUser('user1');

      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        relations: ['store'],
      });
      expect(result).toEqual([mockRating]);
    });
  });

  describe('getStoreAverageRating', () => {
    it('should return average rating for a store', async () => {
      repository.find.mockResolvedValue([
        { ...mockRating, rating: 5 },
        { ...mockRating, rating: 3 },
      ]);

      const result = await service.getStoreAverageRating('store1');

      expect(result).toEqual({
        averageRating: 4.0,
        totalRatings: 2,
      });
    });

    it('should return 0 if no ratings exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.getStoreAverageRating('store1');

      expect(result).toEqual({
        averageRating: 0,
        totalRatings: 0,
      });
    });
  });
});
