import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contributors } from './entities/contributors.entity';
import { CreateContributorInput } from './dto/create-contributor.input';
import { UpdateContributorInput } from './dto/update-contributor.input';

/**
 * ContributorsService handles all contributor-related business logic
 * This service manages CRUD operations for project contributors
 */
@Injectable()
export class ContributorsService {
  constructor(
    // Inject the TypeORM repository for the Contributors entity
    @InjectRepository(Contributors)
    private readonly contributorsRepository: Repository<Contributors>
  ) {}

  /**
   * Retrieves all contributors from the database
   * @returns Promise<Contributors[]> - Array of all contributors
   */
  async findAll(): Promise<Contributors[]> {
    return this.contributorsRepository.find({
      // Load related projects
      relations: ['projects'],
      // Order by name alphabetically
      order: { name: 'ASC' }
    });
  }

  /**
   * Finds a single contributor by their ID
   * @param id - The contributor's unique identifier
   * @returns Promise<Contributors> - The contributor object
   * @throws NotFoundException if contributor doesn't exist
   */
  async findOne(id: string): Promise<Contributors> {
    const contributor = await this.contributorsRepository.findOne({
      where: { id },
      relations: ['projects']
    });
    
    if (!contributor) {
      throw new NotFoundException(`Contributor with id ${id} not found`);
    }
    
    return contributor;
  }

  /**
   * Finds a contributor by their email address
   * @param email - The contributor's email
   * @returns Promise<Contributors | null> - Contributor object or null
   */
  async findByEmail(email: string): Promise<Contributors | null> {
    return this.contributorsRepository.findOne({ where: { email } });
  }

  /**
   * Finds a contributor by their GitHub profile
   * @param github - The contributor's GitHub username/URL
   * @returns Promise<Contributors | null> - Contributor object or null
   */
  async findByGithub(github: string): Promise<Contributors | null> {
    return this.contributorsRepository.findOne({ where: { github } });
  }

  /**
   * Creates a new contributor in the database
   * @param createContributorInput - Contributor data from GraphQL input
   * @returns Promise<Contributors> - The created contributor object
   * @throws ConflictException if email or GitHub already exists
   */
  async create(createContributorInput: CreateContributorInput): Promise<Contributors> {
    // Check if contributor with this email already exists
    const existingByEmail = await this.findByEmail(createContributorInput.email);
    if (existingByEmail) {
      throw new ConflictException(`Contributor with email '${createContributorInput.email}' already exists`);
    }

    // Check if contributor with this GitHub profile already exists
    const existingByGithub = await this.findByGithub(createContributorInput.github);
    if (existingByGithub) {
      throw new ConflictException(`Contributor with GitHub '${createContributorInput.github}' already exists`);
    }

    // Create new contributor object
    const newContributor = this.contributorsRepository.create(createContributorInput);
    
    // Save to database and return the result
    return this.contributorsRepository.save(newContributor);
  }

  /**
   * Updates an existing contributor's information
   * @param id - The contributor's ID to update
   * @param updateContributorInput - Updated contributor data
   * @returns Promise<Contributors> - Updated contributor object
   * @throws NotFoundException if contributor doesn't exist
   * @throws ConflictException if new email/GitHub conflicts with existing contributor
   */
  async update(id: string, updateContributorInput: UpdateContributorInput): Promise<Contributors> {
    // First, find the contributor by ID
    const contributor = await this.findOne(id); // This will throw NotFoundException if not found

    // If email is being updated, check for conflicts
    if (updateContributorInput.email && updateContributorInput.email !== contributor.email) {
      const existingByEmail = await this.findByEmail(updateContributorInput.email);
      if (existingByEmail) {
        throw new ConflictException(`Contributor with email '${updateContributorInput.email}' already exists`);
      }
    }

    // If GitHub is being updated, check for conflicts
    if (updateContributorInput.github && updateContributorInput.github !== contributor.github) {
      const existingByGithub = await this.findByGithub(updateContributorInput.github);
      if (existingByGithub) {
        throw new ConflictException(`Contributor with GitHub '${updateContributorInput.github}' already exists`);
      }
    }

    // Merge the update data into the existing contributor object
    Object.assign(contributor, updateContributorInput);

    // Save the updated contributor to the database
    return this.contributorsRepository.save(contributor);
  }

  /**
   * Deletes a contributor from the database
   * @param id - The contributor's ID to delete
   * @returns Promise<boolean> - True if deleted successfully
   * @throws NotFoundException if contributor doesn't exist
   */
  async remove(id: string): Promise<boolean> {
    // First check if the contributor exists
    await this.findOne(id); // This will throw NotFoundException if not found

    // Attempt to delete the contributor
    const result = await this.contributorsRepository.delete(id);
    
    // Return true if deletion was successful
    return (result.affected ?? 0) > 0;
  }

  /**
   * Finds multiple contributors by their IDs
   * Useful for loading contributors for projects
   * @param ids - Array of contributor IDs
   * @returns Promise<Contributors[]> - Array of found contributors
   */
  async findByIds(ids: string[]): Promise<Contributors[]> {
    if (ids.length === 0) return [];
    
    return this.contributorsRepository.findByIds(ids);
  }
}