import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AboutMe } from './entities/aboutMe.entity';
import { AboutMeService } from './aboutMe.service';
import { CreateAboutMeInput } from './dto/create-aboutMe.input';
import { UpdateAboutMeInput } from './dto/update-aboutMe.input';
import { UploadService } from '../upload/upload.service';
import type { FileUpload } from '../upload/upload.service';
import { GraphQLUpload } from '../upload/scalars/upload.scalar';

/**
 * AboutMeResolver handles GraphQL queries and mutations for personal information
 * This manages the AboutMe entity which should be a singleton
 */
@Resolver(() => AboutMe)
export class AboutMeResolver {
  constructor(
    private readonly aboutMeService: AboutMeService,
    private readonly uploadService: UploadService
  ) {}

  /**
   * GraphQL Query: Get the AboutMe information
   * Query: { 
   *   aboutMe { 
   *     id fullName dob startedCoding bio imageUrl
   *     technologies { id name icon level }
   *     social { id name link icon }
   *   } 
   * }
   */
  @Query(() => AboutMe, { 
    name: 'aboutMe',
    description: 'Get personal information and bio',
    nullable: true 
  })
  async getAboutMe(): Promise<AboutMe | null> {
    return this.aboutMeService.getAboutMe();
  }

  /**
   * GraphQL Mutation: Create the AboutMe information
   * Mutation: { 
   *   createAboutMe(input: { 
   *     fullName: "John Doe", 
   *     dob: "1990-01-01",
   *     startedCoding: "2015-01-01",
   *     bio: "I'm a passionate developer...",
   *     technologyIds: ["tech-uuid-1", "tech-uuid-2"]
   *   }) {
   *     id fullName bio technologies { name }
   *   }
   * }
   */
  @Mutation(() => AboutMe, {
    description: 'Create personal information (should only be done once)'
  })
  async createAboutMe(
    @Args('input') createAboutMeInput: CreateAboutMeInput
  ): Promise<AboutMe> {
    return this.aboutMeService.create(createAboutMeInput);
  }

  /**
   * GraphQL Mutation: Update the AboutMe information
   * Mutation: {
   *   updateAboutMe(input: { 
   *     bio: "Updated bio text...",
   *     imageUrl: "https://example.com/new-photo.jpg"
   *   }) {
   *     id fullName bio imageUrl updatedAt
   *   }
   * }
   */
  @Mutation(() => AboutMe, {
    description: 'Update personal information'
  })
  async updateAboutMe(
    @Args('input') updateAboutMeInput: UpdateAboutMeInput
  ): Promise<AboutMe> {
    return this.aboutMeService.update(updateAboutMeInput);
  }

  /**
   * GraphQL Mutation: Delete the AboutMe information
   * Mutation: { deleteAboutMe }
   */
  @Mutation(() => Boolean, {
    description: 'Delete personal information'
  })
  async deleteAboutMe(): Promise<boolean> {
    return this.aboutMeService.remove();
  }

  /**
   * GraphQL Mutation: Upload and set profile image
   * Mutation: { uploadProfileImage(file: Upload!) }
   */
  @Mutation(() => AboutMe, {
    description: 'Upload and set profile image for AboutMe'
  })
  async uploadAndSetProfileImage(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload
  ): Promise<AboutMe> {
    // Upload the image
    const imageUrl = await this.uploadService.uploadImage(file, 'profiles');
    
    // Update the AboutMe with the new image URL
    return this.aboutMeService.update({ imageUrl });
  }
}