import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutMe } from './entities/aboutMe.entity';
import { AboutMeService } from './aboutMe.service';
import { AboutMeResolver } from './aboutMe.resolver';
import { AboutMeController } from './aboutMe.controller';
import { SkillsModule } from '../skills/skills.module';
import { ImagesModule } from '../images/images.module';

/**
 * AboutMe Module
 * Handles personal information, bio, and social media links
 * This is typically a singleton - only one AboutMe record should exist
 */
@Module({
  imports: [
    // Import the AboutMe entity for TypeORM
    TypeOrmModule.forFeature([AboutMe]),
    
    // Import SkillsModule for managing personal skills
    SkillsModule,
    
    // Import ImagesModule for image management with Cloudinary
    ImagesModule,
  ],
  controllers: [
    AboutMeController  // REST controller for file uploads
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