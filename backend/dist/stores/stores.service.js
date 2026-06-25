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
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("./entities/store.entity");
let StoresService = class StoresService {
    constructor(storesRepository) {
        this.storesRepository = storesRepository;
    }
    async create(createStoreDto) {
        const store = this.storesRepository.create(createStoreDto);
        return this.storesRepository.save(store);
    }
    async findAll(filters, sortBy, sortOrder = 'ASC') {
        const queryBuilder = this.storesRepository
            .createQueryBuilder('store')
            .leftJoinAndSelect('store.owner', 'owner')
            .leftJoinAndSelect('store.ratings', 'ratings');
        if (filters?.name) {
            queryBuilder.andWhere('store.name LIKE :name', { name: `%${filters.name}%` });
        }
        if (filters?.address) {
            queryBuilder.andWhere('store.address LIKE :address', { address: `%${filters.address}%` });
        }
        if (sortBy) {
            const validSortFields = ['name', 'email', 'address', 'createdAt'];
            if (validSortFields.includes(sortBy)) {
                queryBuilder.orderBy(`store.${sortBy}`, sortOrder);
            }
        }
        return queryBuilder.getMany();
    }
    async findOne(id) {
        const store = await this.storesRepository.findOne({
            where: { id },
            relations: ['owner', 'ratings', 'ratings.user'],
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        return store;
    }
    async getStoreWithRating(storeId, userId) {
        const store = await this.storesRepository
            .createQueryBuilder('store')
            .leftJoinAndSelect('store.owner', 'owner')
            .leftJoin('store.ratings', 'ratings')
            .leftJoin('ratings.user', 'ratingUser')
            .addSelect([
            'ratings.id',
            'ratings.rating',
            'ratings.userId',
            'ratingUser.id',
            'ratingUser.name',
            'ratingUser.email',
        ])
            .where('store.id = :storeId', { storeId })
            .getOne();
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        const userRating = store.ratings.find((r) => r.userId === userId);
        const overallRating = store.ratings.length > 0
            ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
            : 0;
        return {
            ...store,
            overallRating: parseFloat(overallRating.toFixed(2)),
            userRating: userRating ? userRating.rating : null,
        };
    }
    async getStoresForUser(userId, filters) {
        const stores = await this.findAll(filters);
        return Promise.all(stores.map(async (store) => {
            const overallRating = store.ratings.length > 0
                ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
                : 0;
            const userRating = store.ratings.find((r) => r.userId === userId);
            return {
                id: store.id,
                name: store.name,
                address: store.address,
                email: store.email,
                overallRating: parseFloat(overallRating.toFixed(2)),
                userRating: userRating ? userRating.rating : null,
            };
        }));
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StoresService);
//# sourceMappingURL=stores.service.js.map