import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributors } from './entities/contributors.entity';
import { ContributorsService } from './contributors.service';
import { ContributorsResolver } from './contributors.resolver';

/**
 * Contributors Module
 * Handles all contributor-related functionality
 * Contributors represent people who have worked on projects
 */
@Module({
  imports: [
    // Import the Contributors entity for TypeORM
    TypeOrmModule.forFeature([Contributors]),
  ],
  providers: [
    ContributorsService,  // Service containing business logic
    ContributorsResolver  // GraphQL resolver
  ],
  exports: [
    ContributorsService   // Export service for other modules
  ],
})
export class ContributorsModule {}