import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialMedia } from './entities/socialMedia.entity';
import { CreateSocialMediaInput } from './dto/create-socialMedia.input';
import { UpdateSocialMediaInput } from './dto/update-socialMedia.input';
import { AboutMeService } from '../aboutMe/aboutMe.service';

/**
 * SocialMediaService handles all social media link management
 * Social media links are associated with the AboutMe entity
 */
@Injectable()
export class SocialMediaService {
  constructor(
    // Inject the TypeORM repository for the SocialMedia entity
    @InjectRepository(SocialMedia)
    private readonly socialMediaRepository: Repository<SocialMedia>,
    
    // Inject AboutMeService to link social media to AboutMe
    private readonly aboutMeService: AboutMeService,
  ) {}

  /**
   * Retrieves all social media links
   * @returns Promise<SocialMedia[]> - Array of all social media links
   */
  async findAll(): Promise<SocialMedia[]> {
    return this.socialMediaRepository.find({
      relations: ['aboutMe'], // Load related AboutMe information
      order: { name: 'ASC' } // Order alphabetically by name
    });
  }

  /**
   * Finds a single social media link by its ID
   * @param id - The social media link's unique identifier
   * @returns Promise<SocialMedia> - The social media object
   * @throws NotFoundException if social media link doesn't exist
   */
  async findOne(id: string): Promise<SocialMedia> {
    const socialMedia = await this.socialMediaRepository.findOne({
      where: { id },
      relations: ['aboutMe']
    });
    
    if (!socialMedia) {
      throw new NotFoundException(`Social media link with id ${id} not found`);
    }
    
    return socialMedia;
  }

  /**
   * Creates a new social media link
   * @param createSocialMediaInput - Social media data from GraphQL input
   * @returns Promise<SocialMedia> - The created social media object
   * @throws NotFoundException if AboutMe doesn't exist
   */
  async create(createSocialMediaInput: CreateSocialMediaInput): Promise<SocialMedia> {
    // Get the AboutMe record (must exist to link social media)
    const aboutMe = await this.aboutMeService.getAboutMe();
    if (!aboutMe) {
      throw new NotFoundException('AboutMe information must be created first before adding social media links');
    }

    // Create the social media object
    const newSocialMedia = this.socialMediaRepository.create({
      name: createSocialMediaInput.name,
      link: createSocialMediaInput.link,
      icon: createSocialMediaInput.icon,
      aboutMe: aboutMe, // Link to the AboutMe entity
    });

    // Save to database and return the result
    return this.socialMediaRepository.save(newSocialMedia);
  }

  /**
   * Updates an existing social media link
   * @param id - The social media link's ID to update
   * @param updateSocialMediaInput - Updated social media data
   * @returns Promise<SocialMedia> - Updated social media object
   * @throws NotFoundException if social media link doesn't exist
   */
  async update(id: string, updateSocialMediaInput: UpdateSocialMediaInput): Promise<SocialMedia> {
    // First, find the social media link by ID
    const socialMedia = await this.findOne(id); // This will throw NotFoundException if not found

    // Merge the update data into the existing social media object
    Object.assign(socialMedia, updateSocialMediaInput);

    // Save the updated social media link to the database
    return this.socialMediaRepository.save(socialMedia);
  }

  /**
   * Deletes a social media link from the database
   * @param id - The social media link's ID to delete
   * @returns Promise<boolean> - True if deleted successfully
   * @throws NotFoundException if social media link doesn't exist
   */
  async remove(id: string): Promise<boolean> {
    // First check if the social media link exists
    await this.findOne(id); // This will throw NotFoundException if not found

    // Attempt to delete the social media link
    const result = await this.socialMediaRepository.delete(id);
    
    // Return true if deletion was successful
    return (result.affected ?? 0) > 0;
  }

  /**
   * Gets all social media links for the AboutMe entity
   * @returns Promise<SocialMedia[]> - Array of social media links
   */
  async findByAboutMe(): Promise<SocialMedia[]> {
    // Get the AboutMe record
    const aboutMe = await this.aboutMeService.getAboutMe();
    if (!aboutMe) {
      return []; // Return empty array if no AboutMe exists
    }

    // Find all social media links for this AboutMe
    return this.socialMediaRepository.find({
      where: { aboutMe: { id: aboutMe.id } },
      order: { name: 'ASC' }
    });
  }
}