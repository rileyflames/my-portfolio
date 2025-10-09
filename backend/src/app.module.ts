import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'

// GraphQL imports
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphQLUpload } from './upload/scalars/upload.scalar';

// DataBase Imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

// Rate limiting
import { ThrottlerModule } from '@nestjs/throttler';

// Security
import { SecurityModule } from './security/security.module';
import { SecurityHeadersMiddleware } from './security/security-headers.middleware';

// Import all application modules
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { SkillsModule } from './skills/skills.module';
import { ProjectsModule } from './projects/projects.module';
import { ContributorsModule } from './contributors/contributors.module';
import { AboutMeModule } from './aboutMe/aboutMe.module';
import { SocialMediaModule } from './socialMedia/socialMedia.module';
import { MessagesModule } from './messages/messages.module';
import { UploadModule } from './upload/upload.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    // load the .ev
    ConfigModule.forRoot({
      isGlobal : true
    }),

    /**
     * Rate Limiting Configuration
     * 
     * PURPOSE: Prevents brute-force attacks on login endpoint
     * 
     * SETTINGS:
     * - ttl: Time window in milliseconds (60000ms = 60 seconds)
     * - limit: Maximum requests allowed per time window (5 requests)
     * 
     * EXAMPLE: If someone tries to login 5 times in 60 seconds,
     * they'll get a 429 Too Many Requests error and must wait
     */
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds
      limit: 5,   // 5 requests per 60 seconds
    }]),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver : ApolloDriver,
      autoSchemaFile : join(process.cwd(), 'src/schema.gql'),
      playground : true,
      resolvers: { Upload: GraphQLUpload },
      // Add context to include request/response for guards
      context: ({ req, res }) => ({ req, res }),
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
        // WARNING: Set to false in production
        synchronize: true, // Let TypeORM handle schema updates
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

    // Security module
    SecurityModule,     // Input sanitization and security utilities
    
    // All application modules
    UserModule,         // User management and authentication
    AuthModule,         // JWT authentication and login
    SkillsModule,       // Skills management
    ProjectsModule,     // Portfolio projects management
    ContributorsModule, // Project contributors management
    AboutMeModule,      // Personal information and bio
    SocialMediaModule,  // Social media links and profiles
    MessagesModule,     // Contact form messages with soft deletion
    UploadModule,       // File upload functionality
    CloudinaryModule,   // Cloudinary image upload configuration
    ImagesModule,       // Image management with Cloudinary + Postgres
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  /**
   * Configure middleware
   * Apply security headers to all routes
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityHeadersMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
