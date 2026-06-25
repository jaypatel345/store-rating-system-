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
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rating_entity_1 = require("./entities/rating.entity");
let RatingsService = class RatingsService {
    constructor(ratingsRepository) {
        this.ratingsRepository = ratingsRepository;
    }
    async create(createRatingDto, userId) {
        const existingRating = await this.ratingsRepository.findOne({
            where: {
                userId,
                storeId: createRatingDto.storeId,
            },
        });
        if (existingRating) {
            throw new common_1.ConflictException('You have already rated this store. Use PUT to update your rating.');
        }
        const rating = this.ratingsRepository.create({
            ...createRatingDto,
            userId,
        });
        return this.ratingsRepository.save(rating);
    }
    async update(id, createRatingDto, userId) {
        const rating = await this.ratingsRepository.findOne({
            where: { id },
        });
        if (!rating) {
            throw new common_1.NotFoundException('Rating not found');
        }
        if (rating.userId !== userId) {
            throw new common_1.ConflictException('You can only update your own ratings');
        }
        rating.rating = createRatingDto.rating;
        return this.ratingsRepository.save(rating);
    }
    async findByStore(storeId) {
        return this.ratingsRepository.find({
            where: { storeId },
            relations: ['user'],
        });
    }
    async findByUser(userId) {
        return this.ratingsRepository.find({
            where: { userId },
            relations: ['store'],
        });
    }
    async getStoreAverageRating(storeId) {
        const ratings = await this.ratingsRepository.find({
            where: { storeId },
        });
        if (ratings.length === 0) {
            return { averageRating: 0, totalRatings: 0 };
        }
        const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
        return {
            averageRating: parseFloat(averageRating.toFixed(2)),
            totalRatings: ratings.length,
        };
    }
    async getStoreOwnerDashboard(ownerId) {
        const ratings = await this.ratingsRepository
            .createQueryBuilder('rating')
            .leftJoinAndSelect('rating.store', 'store')
            .leftJoinAndSelect('rating.user', 'user')
            .leftJoin('store.owner', 'owner')
            .where('owner.id = :ownerId', { ownerId })
            .getMany();
        const storeRatings = ratings.reduce((acc, rating) => {
            if (!acc[rating.storeId]) {
                acc[rating.storeId] = {
                    storeId: rating.storeId,
                    storeName: rating.store.name,
                    ratings: [],
                };
            }
            acc[rating.storeId].ratings.push({
                user: {
                    id: rating.user.id,
                    name: rating.user.name,
                    email: rating.user.email,
                },
                rating: rating.rating,
                createdAt: rating.createdAt,
            });
            return acc;
        }, {});
        const result = Object.values(storeRatings).map((store) => {
            const averageRating = store.ratings.length > 0
                ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
                : 0;
            return {
                storeId: store.storeId,
                storeName: store.storeName,
                averageRating: parseFloat(averageRating.toFixed(2)),
                totalRatings: store.ratings.length,
                ratings: store.ratings,
            };
        });
        return result;
    }
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rating_entity_1.Rating)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RatingsService);
//# sourceMappingURL=ratings.service.js.map