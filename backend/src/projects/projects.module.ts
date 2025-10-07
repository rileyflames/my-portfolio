import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { TechnologiesModule } from '../technologies/technologies.module';
import { UserModule } from '../users/user.module';
import { UploadModule } from '../upload/upload.module';

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
    TechnologiesModule, // For managing project technologies
    UserModule,         // For managing project creators/editors
    UploadModule,       // For image upload functionality
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