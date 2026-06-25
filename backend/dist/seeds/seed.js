"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const user_entity_1 = require("../users/entities/user.entity");
const bcrypt = require("bcrypt");
async function seed(dataSource) {
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const existingAdmin = await userRepository.findOne({
        where: { email: 'admin@store-rating.com' },
    });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        const admin = userRepository.create({
            name: 'System Administrator User Account',
            email: 'admin@store-rating.com',
            password: hashedPassword,
            address: 'Admin Office, 123 System Street',
            role: user_entity_1.UserRole.ADMIN,
        });
        await userRepository.save(admin);
        console.log('✅ Admin user created successfully');
        console.log('Email: admin@store-rating.com');
        console.log('Password: Admin123!');
    }
    else {
        console.log('ℹ️ Admin user already exists');
    }
}
//# sourceMappingURL=seed.js.map