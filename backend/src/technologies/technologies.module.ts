import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tech } from './entities/tech.entity';
import { TechnologiesService } from './technologies.service';
import { TechnologiesResolver } from './technologies.resolver';

/**
 * Technologies Module
 * Handles all technology-related functionality including CRUD operations
 * Technologies represent programming languages, frameworks, tools, etc.
 */
@Module({
  imports: [
    // Import the Tech entity so TypeORM is aware of it
    // This allows us to inject the repository in the service
    TypeOrmModule.forFeature([Tech]),
  ],
  providers: [
    TechnologiesService, // Service containing business logic
    TechnologiesResolver // GraphQL resolver for handling queries/mutations
  ],
  exports: [
    TechnologiesService // Export service so other modules can use it
  ],
})
export class TechnologiesModule {}