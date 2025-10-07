import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tech } from './entities/tech.entity';
import { CreateTechnologyInput } from './dto/create-technology.input';
import { UpdateTechnologyInput } from './dto/update-technology.input';

/**
 * TechnologiesService handles all technology-related business logic
 * This service manages CRUD operations for technologies/skills
 */
@Injectable()
export class TechnologiesService {
  constructor(
    // Inject the TypeORM repository for the Tech entity
    @InjectRepository(Tech)
    private readonly techRepository: Repository<Tech>
  ) {}

  /**
   * Retrieves all technologies from the database
   * @returns Promise<Tech[]> - Array of all technologies
   */
  async findAll(): Promise<Tech[]> {
    return this.techRepository.find({
      // Order by name alphabetically for consistent results
      order: { name: 'ASC' }
    });
  }

  /**
   * Finds a single technology by its ID
   * @param id - The technology's unique identifier
   * @returns Promise<Tech> - The technology object
   * @throws NotFoundException if technology doesn't exist
   */
  async findOne(id: string): Promise<Tech> {
    const tech = await this.techRepository.findOne({ where: { id } });
    if (!tech) {
      throw new NotFoundException(`Technology with id ${id} not found`);
    }
    return tech;
  }

  /**
   * Finds a technology by its name
   * @param name - The technology's name
   * @returns Promise<Tech | null> - Technology object or null if not found
   */
  async findByName(name: string): Promise<Tech | null> {
    return this.techRepository.findOne({ where: { name } });
  }

  /**
   * Creates a new technology in the database
   * @param createTechnologyInput - Technology data from GraphQL input
   * @returns Promise<Tech> - The created technology object
   * @throws ConflictException if technology name already exists
   */
  async create(createTechnologyInput: CreateTechnologyInput): Promise<Tech> {
    // Check if technology with this name already exists
    const existingTech = await this.findByName(createTechnologyInput.name);
    if (existingTech) {
      throw new ConflictException(`Technology '${createTechnologyInput.name}' already exists`);
    }

    // Create new technology object
    const newTech = this.techRepository.create(createTechnologyInput);
    
    // Save to database and return the result
    return this.techRepository.save(newTech);
  }

  /**
   * Updates an existing technology's information
   * @param id - The technology's ID to update
   * @param updateTechnologyInput - Updated technology data
   * @returns Promise<Tech> - Updated technology object
   * @throws NotFoundException if technology doesn't exist
   * @throws ConflictException if new name conflicts with existing technology
   */
  async update(id: string, updateTechnologyInput: UpdateTechnologyInput): Promise<Tech> {
    // First, find the technology by ID
    const tech = await this.findOne(id); // This will throw NotFoundException if not found

    // If name is being updated, check for conflicts
    if (updateTechnologyInput.name && updateTechnologyInput.name !== tech.name) {
      const existingTech = await this.findByName(updateTechnologyInput.name);
      if (existingTech) {
        throw new ConflictException(`Technology '${updateTechnologyInput.name}' already exists`);
      }
    }

    // Merge the update data into the existing technology object
    Object.assign(tech, updateTechnologyInput);

    // Save the updated technology to the database
    return this.techRepository.save(tech);
  }

  /**
   * Deletes a technology from the database
   * @param id - The technology's ID to delete
   * @returns Promise<boolean> - True if deleted successfully
   * @throws NotFoundException if technology doesn't exist
   */
  async remove(id: string): Promise<boolean> {
    // First check if the technology exists
    await this.findOne(id); // This will throw NotFoundException if not found

    // Attempt to delete the technology
    const result = await this.techRepository.delete(id);
    
    // Return true if deletion was successful
    return (result.affected ?? 0) > 0;
  }

  /**
   * Finds multiple technologies by their IDs
   * Useful for loading technologies for projects
   * @param ids - Array of technology IDs
   * @returns Promise<Tech[]> - Array of found technologies
   */
  async findByIds(ids: string[]): Promise<Tech[]> {
    if (ids.length === 0) return [];
    
    return this.techRepository.findByIds(ids);
  }
}