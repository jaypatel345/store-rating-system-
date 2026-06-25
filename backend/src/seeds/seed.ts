import { DataSource } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seed(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

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
      role: UserRole.ADMIN,
    });

    await userRepository.save(admin);
    console.log('✅ Admin user created successfully');
    console.log('Email: admin@store-rating.com');
    console.log('Password: Admin123!');
  } else {
    console.log('ℹ️ Admin user already exists');
  }
}
