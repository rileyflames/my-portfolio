import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Skill } from './entities/skill.entity';
import { SkillsService } from './skills.service';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { UploadService } from '../upload/upload.service';
import type { FileUpload } from '../upload/upload.service';
import { GraphQLUpload } from '../upload/scalars/upload.scalar';

/**
 * SkillsResolver handles GraphQL queries and mutations for skills
 * This is the entry point for all skill-related GraphQL operations
 * 
 * Note: We keep the GraphQL query names as 'technologies' for backward compatibility
 * with the frontend, but internally we use 'skills' terminology
 */
@Resolver(() => Skill)
export class SkillsResolver {
  constructor(
    private readonly skillsService: SkillsService,
    private readonly uploadService: UploadService
  ) {}

  /**
   * GraphQL Query: Get all skills
   * Query: { technologies { id name icon level category } }
   * Note: Named 'technologies' for frontend compatibility
   */
  @Query(() => [Skill], { 
    name: 'technologies',
    description: 'Get all skills' 
  })
  async getAllSkills(): Promise<Skill[]> {
    return this.skillsService.findAll();
  }

  /**
   * GraphQL Query: Get a single skill by ID
   * Query: { technology(id: "uuid") { id name icon level category } }
   * Note: Named 'technology' for frontend compatibility
   */
  @Query(() => Skill, { 
    name: 'technology',
    description: 'Get a single skill by ID',
    nullable: true 
  })
  async getSkill(@Args('id') id: string): Promise<Skill> {
    return this.skillsService.findOne(id);
  }

  /**
   * GraphQL Mutation: Create a new skill
   * Mutation: { 
   *   createTechnology(input: { name: "React", icon: "react-icon", level: INTERMEDIATE, category: FRAMEWORKS }) {
   *     id name icon level category createdAt
   *   }
   * }
   * Note: Named 'createTechnology' for frontend compatibility
   */
  @Mutation(() => Skill, {
    name: 'createTechnology',
    description: 'Create a new skill'
  })
  async createSkill(
    @Args('input') createSkillInput: CreateSkillInput
  ): Promise<Skill> {
    return this.skillsService.create(createSkillInput);
  }

  /**
   * GraphQL Mutation: Update an existing skill
   * Mutation: {
   *   updateTechnology(id: "uuid", input: { level: ADVANCED }) {
   *     id name icon level category updatedAt
   *   }
   * }
   * Note: Named 'updateTechnology' for frontend compatibility
   */
  @Mutation(() => Skill, {
    name: 'updateTechnology',
    description: 'Update an existing skill'
  })
  async updateSkill(
    @Args('id') id: string,
    @Args('input') updateSkillInput: UpdateSkillInput
  ): Promise<Skill> {
    return this.skillsService.update(id, updateSkillInput);
  }

  /**
   * GraphQL Mutation: Delete a skill
   * Mutation: { deleteTechnology(id: "uuid") }
   * Note: Named 'deleteTechnology' for frontend compatibility
   */
  @Mutation(() => Boolean, {
    name: 'deleteTechnology',
    description: 'Delete a skill'
  })
  async deleteSkill(@Args('id') id: string): Promise<boolean> {
    return this.skillsService.remove(id);
  }

  /**
   * GraphQL Mutation: Upload and set skill icon
   * Mutation: { uploadTechnologyIcon(technologyId: "uuid", file: Upload!) }
   * Note: Named 'uploadTechnologyIcon' for frontend compatibility
   */
  @Mutation(() => Skill, {
    name: 'uploadTechnologyIcon',
    description: 'Upload and set icon for a skill'
  })
  async uploadSkillIcon(
    @Args('technologyId') skillId: string,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload
  ): Promise<Skill> {
    // Upload the image
    const iconUrl = await this.uploadService.uploadImage(file, 'skills');
    
    // Update the skill with the new icon URL
    return this.skillsService.update(skillId, { icon: iconUrl });
  }
}
