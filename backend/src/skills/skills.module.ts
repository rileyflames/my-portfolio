import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { SkillsService } from './skills.service';
import { SkillsResolver } from './skills.resolver';
import { UploadModule } from '../upload/upload.module';

/**
 * Skills Module
 * Handles all skill-related functionality including CRUD operations
 * Skills represent programming languages, frameworks, tools, databases, etc.
 */
@Module({
  imports: [
    // Import the Skill entity so TypeORM is aware of it
    // This allows us to inject the repository in the service
    TypeOrmModule.forFeature([Skill]),
    
    // Import UploadModule for image upload functionality
    UploadModule,
  ],
  providers: [
    SkillsService, // Service containing business logic
    SkillsResolver // GraphQL resolver for handling queries/mutations
  ],
  exports: [
    SkillsService // Export service so other modules can use it
  ],
})
export class SkillsModule {}
