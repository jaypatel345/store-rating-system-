"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const ratings_service_1 = require("./ratings.service");
const rating_entity_1 = require("./entities/rating.entity");
describe('RatingsService', () => {
    let service;
    let repository;
    const mockRating = {
        id: '1',
        rating: 5,
        userId: 'user1',
        storeId: 'store1',
        user: {},
        store: {},
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                ratings_service_1.RatingsService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(rating_entity_1.Rating),
                    useValue: mockRepository,
                },
            ],
        }).compile();
        service = module.get(ratings_service_1.RatingsService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(rating_entity_1.Rating));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('create', () => {
        it('should create a new rating', async () => {
            const createRatingDto = {
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
            const createRatingDto = {
                rating: 5,
                storeId: 'store1',
            };
            repository.findOne.mockResolvedValue(mockRating);
            await expect(service.create(createRatingDto, 'user1')).rejects.toThrow(common_1.ConflictException);
        });
    });
    describe('update', () => {
        it('should update an existing rating', async () => {
            const createRatingDto = {
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
            const createRatingDto = {
                rating: 4,
                storeId: 'store1',
            };
            repository.findOne.mockResolvedValue(null);
            await expect(service.update('1', createRatingDto, 'user1')).rejects.toThrow(common_1.NotFoundException);
        });
        it('should throw ConflictException if user is not the owner', async () => {
            const createRatingDto = {
                rating: 4,
                storeId: 'store1',
            };
            repository.findOne.mockResolvedValue({ ...mockRating, userId: 'user2' });
            await expect(service.update('1', createRatingDto, 'user1')).rejects.toThrow(common_1.ConflictException);
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
//# sourceMappingURL=ratings.service.spec.js.map