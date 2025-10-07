import { DataSource } from 'typeorm';
import { User, UserRole } from './src/users/entities/user.entity';
import * as argon2 from 'argon2';

// Configure your database connection here
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'mydb',
  entities: [User],
  synchronize: false, // Don't auto-sync in production
});

async function seed() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);

  // Example users
  const users = [
    {
      name: 'Admin',
      email: 'admin@example.com',
      password: await argon2.hash('adminpassword'),
      role: UserRole.ADMIN,
    },
    {
      name: 'Editor',
      email: 'editor@example.com',
      password: await argon2.hash('editorpassword'),
      role: UserRole.EDITOR,
    },
  ];

  for (const userData of users) {
    const exists = await userRepository.findOne({ where: { email: userData.email } });
    if (!exists) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`Created user: ${user.email}`);
    } else {
      console.log(`User already exists: ${userData.email}`);
    }
  }

  await AppDataSource.destroy();
  console.log('Seeding complete!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
