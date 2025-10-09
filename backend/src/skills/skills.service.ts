import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';

/**
 * SkillsService handles all skill-related business logic
 * This service manages CRUD operations for skills
 */
@Injectable()
export class SkillsService {
  constructor(
    // Inject the TypeORM repository for the Skill entity
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>
  ) {}

  /**
   * Retrieves all skills from the database
   * @returns Promise<Skill[]> - Array of all skills
   */
  async findAll(): Promise<Skill[]> {
    return this.skillRepository.find({
      // Order by name alphabetically for consistent results
      order: { name: 'ASC' }
    });
  }

  /**
   * Finds a single skill by its ID
   * @param id - The skill's unique identifier
   * @returns Promise<Skill> - The skill object
   * @throws NotFoundException if skill doesn't exist
   */
  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill with id ${id} not found`);
    }
    return skill;
  }

  /**
   * Finds a skill by its name
   * @param name - The skill's name
   * @returns Promise<Skill | null> - Skill object or null if not found
   */
  async findByName(name: string): Promise<Skill | null> {
    return this.skillRepository.findOne({ where: { name } });
  }

  /**
   * Creates a new skill in the database
   * @param createSkillInput - Skill data from GraphQL input
   * @returns Promise<Skill> - The created skill object
   * @throws ConflictException if skill name already exists
   */
  async create(createSkillInput: CreateSkillInput): Promise<Skill> {
    // Check if skill with this name already exists
    const existingSkill = await this.findByName(createSkillInput.name);
    if (existingSkill) {
      throw new ConflictException(`Skill '${createSkillInput.name}' already exists`);
    }

    // Create new skill object
    const newSkill = this.skillRepository.create(createSkillInput);
    
    // Save to database and return the result
    return this.skillRepository.save(newSkill);
  }

  /**
   * Updates an existing skill's information
   * @param id - The skill's ID to update
   * @param updateSkillInput - Updated skill data
   * @returns Promise<Skill> - Updated skill object
   * @throws NotFoundException if skill doesn't exist
   * @throws ConflictException if new name conflicts with existing skill
   */
  async update(id: string, updateSkillInput: UpdateSkillInput): Promise<Skill> {
    // First, find the skill by ID
    const skill = await this.findOne(id); // This will throw NotFoundException if not found

    // If name is being updated, check for conflicts
    if (updateSkillInput.name && updateSkillInput.name !== skill.name) {
      const existingSkill = await this.findByName(updateSkillInput.name);
      if (existingSkill) {
        throw new ConflictException(`Skill '${updateSkillInput.name}' already exists`);
      }
    }

    // Merge the update data into the existing skill object
    Object.assign(skill, updateSkillInput);

    // Save the updated skill to the database
    return this.skillRepository.save(skill);
  }

  /**
   * Deletes a skill from the database
   * @param id - The skill's ID to delete
   * @returns Promise<boolean> - True if deleted successfully
   * @throws NotFoundException if skill doesn't exist
   */
  async remove(id: string): Promise<boolean> {
    // First check if the skill exists
    await this.findOne(id); // This will throw NotFoundException if not found

    // Attempt to delete the skill
    const result = await this.skillRepository.delete(id);
    
    // Return true if deletion was successful
    return (result.affected ?? 0) > 0;
  }

  /**
   * Finds multiple skills by their IDs
   * Useful for loading skills for projects
   * @param ids - Array of skill IDs
   * @returns Promise<Skill[]> - Array of found skills
   */
  async findByIds(ids: string[]): Promise<Skill[]> {
    if (ids.length === 0) return [];
    
    return this.skillRepository.findByIds(ids);
  }
}
