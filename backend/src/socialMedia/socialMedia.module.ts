import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialMedia } from './entities/socialMedia.entity';
import { SocialMediaService } from './socialMedia.service';
import { SocialMediaResolver } from './socialMedia.resolver';
import { AboutMeModule } from '../aboutMe/aboutMe.module';

/**
 * SocialMedia Module
 * Handles social media links and profiles
 * Social media entries are linked to the AboutMe entity
 */
@Module({
  imports: [
    // Import the SocialMedia entity for TypeORM
    TypeOrmModule.forFeature([SocialMedia]),
    
    // Import AboutMeModule since social media links belong to AboutMe
    AboutMeModule,
  ],
  providers: [
    SocialMediaService,  // Service containing business logic
    SocialMediaResolver  // GraphQL resolver
  ],
  exports: [
    SocialMediaService   // Export service for other modules
  ],
})
export class SocialMediaModule {}