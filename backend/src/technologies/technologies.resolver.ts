import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Tech } from './entities/tech.entity';
import { TechnologiesService } from './technologies.service';
import { CreateTechnologyInput } from './dto/create-technology.input';
import { UpdateTechnologyInput } from './dto/update-technology.input';
import { UploadService } from '../upload/upload.service';
import type { FileUpload } from '../upload/upload.service';
import { GraphQLUpload } from '../upload/scalars/upload.scalar';

/**
 * TechnologiesResolver handles GraphQL queries and mutations for technologies
 * This is the entry point for all technology-related GraphQL operations
 */
@Resolver(() => Tech)
export class TechnologiesResolver {
  constructor(
    private readonly technologiesService: TechnologiesService,
    private readonly uploadService: UploadService
  ) {}

  /**
   * GraphQL Query: Get all technologies
   * Query: { technologies { id name icon level } }
   */
  @Query(() => [Tech], { 
    name: 'technologies',
    description: 'Get all technologies/skills' 
  })
  async getAllTechnologies(): Promise<Tech[]> {
    return this.technologiesService.findAll();
  }

  /**
   * GraphQL Query: Get a single technology by ID
   * Query: { technology(id: "uuid") { id name icon level } }
   */
  @Query(() => Tech, { 
    name: 'technology',
    description: 'Get a single technology by ID',
    nullable: true 
  })
  async getTechnology(@Args('id') id: string): Promise<Tech> {
    return this.technologiesService.findOne(id);
  }

  /**
   * GraphQL Mutation: Create a new technology
   * Mutation: { 
   *   createTechnology(input: { name: "React", icon: "react-icon", level: INTERMEDIATE }) {
   *     id name icon level createdAt
   *   }
   * }
   */
  @Mutation(() => Tech, {
    description: 'Create a new technology/skill'
  })
  async createTechnology(
    @Args('input') createTechnologyInput: CreateTechnologyInput
  ): Promise<Tech> {
    return this.technologiesService.create(createTechnologyInput);
  }

  /**
   * GraphQL Mutation: Update an existing technology
   * Mutation: {
   *   updateTechnology(id: "uuid", input: { level: ADVANCED }) {
   *     id name icon level updatedAt
   *   }
   * }
   */
  @Mutation(() => Tech, {
    description: 'Update an existing technology/skill'
  })
  async updateTechnology(
    @Args('id') id: string,
    @Args('input') updateTechnologyInput: UpdateTechnologyInput
  ): Promise<Tech> {
    return this.technologiesService.update(id, updateTechnologyInput);
  }

  /**
   * GraphQL Mutation: Delete a technology
   * Mutation: { deleteTechnology(id: "uuid") }
   */
  @Mutation(() => Boolean, {
    description: 'Delete a technology/skill'
  })
  async deleteTechnology(@Args('id') id: string): Promise<boolean> {
    return this.technologiesService.remove(id);
  }

  /**
   * GraphQL Mutation: Upload and set technology icon
   * Mutation: { uploadTechnologyIcon(technologyId: "uuid", file: Upload!) }
   */
  @Mutation(() => Tech, {
    description: 'Upload and set icon for a technology'
  })
  async uploadTechnologyIcon(
    @Args('technologyId') technologyId: string,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload
  ): Promise<Tech> {
    // Upload the image
    const iconUrl = await this.uploadService.uploadImage(file, 'technologies');
    
    // Update the technology with the new icon URL
    return this.technologiesService.update(technologyId, { icon: iconUrl });
  }
}