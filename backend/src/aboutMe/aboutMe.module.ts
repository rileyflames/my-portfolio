import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutMe } from './entities/aboutMe.entity';
import { AboutMeService } from './aboutMe.service';
import { AboutMeResolver } from './aboutMe.resolver';
import { TechnologiesModule } from '../technologies/technologies.module';

/**
 * AboutMe Module
 * Handles personal information, bio, and social media links
 * This is typically a singleton - only one AboutMe record should exist
 */
@Module({
  imports: [
    // Import the AboutMe entity for TypeORM
    TypeOrmModule.forFeature([AboutMe]),
    
    // Import TechnologiesModule for managing personal tech skills
    TechnologiesModule,
  ],
  providers: [
    AboutMeService,  // Service containing business logic
    AboutMeResolver  // GraphQL resolver
  ],
  exports: [
    AboutMeService   // Export service for other modules
  ],
})
export class AboutMeModule {}