import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'

// GraphQL imports
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// DataBase Imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

// Import all application modules
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { ProjectsModule } from './projects/projects.module';
import { ContributorsModule } from './contributors/contributors.module';
import { AboutMeModule } from './aboutMe/aboutMe.module';
import { SocialMediaModule } from './socialMedia/socialMedia.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    // load the .ev
    ConfigModule.forRoot({
      isGlobal : true
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver : ApolloDriver,
      autoSchemaFile : join(process.cwd(), 'src/schema.gql'),
      playground : true
    }),

    // PostgreSQL TypeORM Configuration
    // This sets up the connection to PostgreSQL database using TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to access environment variables
      inject: [ConfigService], // Inject ConfigService to read from .env file
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Database type
        host: configService.get<string>('POSTGRES_HOST'), // Database host (localhost)
        port: parseInt(configService.get<string>('POSTGRES_PORT') ?? '5432'), // Database port
        username: configService.get<string>('POSTGRES_USER'), // Database username
        password: configService.get<string>('POSTGRES_PASSWORD'), // Database password
        database: configService.get<string>('POSTGRES_DB'), // Database name

        // Tell TypeORM where to find entity files
        // This pattern finds all .entity.ts files in the src directory
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],

        // Auto-create/update database tables based on entities
        // WARNING: Set to false in production to prevent data loss
        synchronize: true, // true for development, false for production
      }),
    }),

    // MongoDB (Mongoose)
    MongooseModule.forRootAsync({
      imports : [ConfigModule],
      inject : [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    // All application modules
    UserModule,         // User management and authentication
    AuthModule,         // JWT authentication and login
    TechnologiesModule, // Technology/skills management
    ProjectsModule,     // Portfolio projects management
    ContributorsModule, // Project contributors management
    AboutMeModule,      // Personal information and bio
    SocialMediaModule,  // Social media links and profiles
    MessagesModule,     // Contact form messages with soft deletion
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
