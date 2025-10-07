import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutMe } from './entities/aboutMe.entity';
import { CreateAboutMeInput } from './dto/create-aboutMe.input';
import { UpdateAboutMeInput } from './dto/update-aboutMe.input';
import { TechnologiesService } from '../technologies/technologies.service';

/**
 * AboutMeService handles personal information management
 * This service manages the AboutMe entity (typically a singleton)
 */
@Injectable()
export class AboutMeService {
  constructor(
    // Inject the TypeORM repository for the AboutMe entity
    @InjectRepository(AboutMe)
    private readonly aboutMeRepository: Repository<AboutMe>,
    
    // Inject TechnologiesService for managing personal skills
    private readonly technologiesService: TechnologiesService,
  ) {}

  /**
   * Gets the AboutMe information (should be only one record)
   * @returns Promise<AboutMe | null> - The AboutMe record or null if not found
   */
  async getAboutMe(): Promise<AboutMe | null> {
    // Find the first (and should be only) AboutMe record
    const aboutMe = await this.aboutMeRepository.findOne({
      relations: ['technologies', 'social'], // Load related technologies and social media
      order: { createdAt: 'ASC' } // Get the oldest (first created) record
    });
    
    return aboutMe;
  }

  /**
   * Creates the AboutMe information
   * @param createAboutMeInput - AboutMe data from GraphQL input
   * @returns Promise<AboutMe> - The created AboutMe object
   * @throws ConflictException if AboutMe already exists
   */
  async create(createAboutMeInput: CreateAboutMeInput): Promise<AboutMe> {
    // Check if AboutMe already exists (should be singleton)
    const existing = await this.getAboutMe();
    if (existing) {
      throw new ConflictException('AboutMe information already exists. Use update instead.');
    }

    // Load technologies if provided
    let technologies = [];
    if (createAboutMeInput.technologyIds && createAboutMeInput.technologyIds.length > 0) {
      technologies = await this.technologiesService.findByIds(createAboutMeInput.technologyIds);
      
      // Check if all requested technologies were found
      if (technologies.length !== createAboutMeInput.technologyIds.length) {
        throw new NotFoundException('One or more technologies not found');
      }
    }

    // Create the AboutMe object
    const newAboutMe = this.aboutMeRepository.create({
      fullName: createAboutMeInput.fullName,
      dob: createAboutMeInput.dob,
      startedCoding: createAboutMeInput.startedCoding,
      bio: createAboutMeInput.bio,
      imageUrl: createAboutMeInput.imageUrl,
      technologies: technologies,
    });

    // Save to database
    const savedAboutMe = await this.aboutMeRepository.save(newAboutMe);
    
    // Return with all relations loaded
    return this.aboutMeRepository.findOne({
      where: { id: savedAboutMe.id },
      relations: ['technologies', 'social']
    });
  }

  /**
   * Updates the AboutMe information
   * @param updateAboutMeInput - Updated AboutMe data
   * @returns Promise<AboutMe> - Updated AboutMe object
   * @throws NotFoundException if AboutMe doesn't exist
   */
  async update(updateAboutMeInput: UpdateAboutMeInput): Promise<AboutMe> {
    // Get the existing AboutMe record
    const aboutMe = await this.getAboutMe();
    if (!aboutMe) {
      throw new NotFoundException('AboutMe information not found. Create it first.');
    }

    // Load new technologies if provided
    let technologies = aboutMe.technologies; // Keep existing technologies by default
    if (updateAboutMeInput.technologyIds !== undefined) {
      if (updateAboutMeInput.technologyIds.length > 0) {
        technologies = await this.technologiesService.findByIds(updateAboutMeInput.technologyIds);
        
        // Check if all requested technologies were found
        if (technologies.length !== updateAboutMeInput.technologyIds.length) {
          throw new NotFoundException('One or more technologies not found');
        }
      } else {
        technologies = []; // Clear technologies if empty array provided
      }
    }

    // Update the AboutMe properties
    Object.assign(aboutMe, {
      fullName: updateAboutMeInput.fullName ?? aboutMe.fullName,
      dob: updateAboutMeInput.dob ?? aboutMe.dob,
      startedCoding: updateAboutMeInput.startedCoding ?? aboutMe.startedCoding,
      bio: updateAboutMeInput.bio ?? aboutMe.bio,
      imageUrl: updateAboutMeInput.imageUrl ?? aboutMe.imageUrl,
      technologies: technologies,
    });

    // Save the updated AboutMe
    await this.aboutMeRepository.save(aboutMe);
    
    // Return with all relations loaded
    return this.aboutMeRepository.findOne({
      where: { id: aboutMe.id },
      relations: ['technologies', 'social']
    });
  }

  /**
   * Deletes the AboutMe information
   * @returns Promise<boolean> - True if deleted successfully
   * @throws NotFoundException if AboutMe doesn't exist
   */
  async remove(): Promise<boolean> {
    // Get the existing AboutMe record
    const aboutMe = await this.getAboutMe();
    if (!aboutMe) {
      throw new NotFoundException('AboutMe information not found');
    }

    // Delete the AboutMe record
    const result = await this.aboutMeRepository.delete(aboutMe.id);
    
    // Return true if deletion was successful
    return (result.affected ?? 0) > 0;
  }

  /**
   * Finds the AboutMe record by ID (internal use)
   * @param id - The AboutMe ID
   * @returns Promise<AboutMe> - The AboutMe object
   * @throws NotFoundException if not found
   */
  async findOne(id: string): Promise<AboutMe> {
    const aboutMe = await this.aboutMeRepository.findOne({
      where: { id },
      relations: ['technologies', 'social']
    });
    
    if (!aboutMe) {
      throw new NotFoundException(`AboutMe with id ${id} not found`);
    }
    
    return aboutMe;
  }
}