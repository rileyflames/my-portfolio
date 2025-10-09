import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsController } from './projects.controller';
import { SkillsModule } from '../skills/skills.module';
import { UserModule } from '../users/user.module';
import { ImagesModule } from '../images/images.module';
import { ContributorsModule } from '../contributors/contributors.module';

/**
 * Projects Module
 * Handles all project-related functionality including CRUD operations
 * Projects represent portfolio projects with technologies, contributors, etc.
 */
@Module({
  imports: [
    // Import the Projects entity for TypeORM
    TypeOrmModule.forFeature([Projects]),
    
    // Import other modules we depend on
    SkillsModule,       // For managing project skills
    UserModule,         // For managing project creators/editors
    ImagesModule,       // For image management with Cloudinary
    ContributorsModule, // For managing project contributors
  ],
  controllers: [
    ProjectsController  // REST controller for file uploads
  ],
  providers: [
    ProjectsService,  // Service containing business logic
    ProjectsResolver  // GraphQL resolver
  ],
  exports: [
    ProjectsService   // Export service for other modules
  ],
})
export class ProjectsModule {}