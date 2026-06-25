"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const user_entity_1 = require("../users/entities/user.entity");
const store_entity_1 = require("../stores/entities/store.entity");
const bcrypt = require("bcrypt");
async function seed(dataSource) {
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const storeRepository = dataSource.getRepository(store_entity_1.Store);
    const existingAdmin = await userRepository.findOne({
        where: { email: 'admin@store-rating.com' },
    });
    let adminUser = existingAdmin;
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        const admin = userRepository.create({
            name: 'System Administrator User Account',
            email: 'admin@store-rating.com',
            password: hashedPassword,
            address: 'Admin Office, 123 System Street',
            role: user_entity_1.UserRole.ADMIN,
        });
        adminUser = await userRepository.save(admin);
        console.log('✅ Admin user created successfully');
        console.log('Email: admin@store-rating.com');
        console.log('Password: Admin123!');
    }
    else {
        console.log('ℹ️ Admin user already exists');
    }
    let storeOwner = await userRepository.findOne({
        where: { email: 'owner@example.com' },
    });
    if (!storeOwner) {
        const hashedPassword = await bcrypt.hash('Owner123!', 10);
        storeOwner = userRepository.create({
            name: 'John Store Owner',
            email: 'owner@example.com',
            password: hashedPassword,
            address: '456 Business Avenue, Suite 100',
            role: user_entity_1.UserRole.STORE_OWNER,
        });
        storeOwner = await userRepository.save(storeOwner);
        console.log('✅ Store owner created successfully');
    }
    else {
        console.log('ℹ️ Store owner already exists');
    }
    const existingStores = await storeRepository.find();
    if (existingStores.length === 0) {
        const sampleStores = [
            {
                name: 'Tech Electronics Store',
                email: 'tech@store.com',
                address: '123 Main Street, Downtown',
                ownerId: storeOwner.id,
            },
            {
                name: 'Fresh Grocery Market',
                email: 'grocery@store.com',
                address: '456 Oak Avenue, Suburb',
                ownerId: storeOwner.id,
            },
            {
                name: 'Fashion Boutique',
                email: 'fashion@store.com',
                address: '789 Pine Road, Mall',
                ownerId: storeOwner.id,
            },
            {
                name: 'Home Furniture Depot',
                email: 'furniture@store.com',
                address: '321 Elm Street, Industrial Park',
                ownerId: storeOwner.id,
            },
            {
                name: 'Sports Equipment Shop',
                email: 'sports@store.com',
                address: '654 Maple Drive, Sports Complex',
                ownerId: storeOwner.id,
            },
        ];
        for (const storeData of sampleStores) {
            const store = storeRepository.create(storeData);
            await storeRepository.save(store);
        }
        console.log('✅ Sample stores created successfully');
    }
    else {
        console.log('ℹ️ Sample stores already exist');
    }
}
//# sourceMappingURL=seed.js.map