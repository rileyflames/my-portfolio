import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AboutMe } from './entities/aboutMe.entity';
import { AboutMeService } from './aboutMe.service';
import { CreateAboutMeInput } from './dto/create-aboutMe.input';
import { UpdateAboutMeInput } from './dto/update-aboutMe.input';
import { Image } from '../images/entities/image.entity';

/**
 * AboutMeResolver handles GraphQL queries and mutations for personal information
 * This manages the AboutMe entity which should be a singleton
 */
@Resolver(() => AboutMe)
export class AboutMeResolver {
  constructor(
    private readonly aboutMeService: AboutMeService
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
   * GraphQL Query: Get profile image
   * Query: { profileImage { id url public_id filename alt_text } }
   */
  @Query(() => Image, {
    name: 'profileImage',
    description: 'Get the profile image for AboutMe',
    nullable: true
  })
  async getProfileImage(): Promise<Image | null> {
    return this.aboutMeService.getProfileImage();
  }

  /**
   * GraphQL Mutation: Delete profile image
   * Mutation: { deleteProfileImage { id fullName imageUrl } }
   */
  @Mutation(() => AboutMe, {
    description: 'Delete profile image from AboutMe and Cloudinary'
  })
  async deleteProfileImage(): Promise<AboutMe> {
    return this.aboutMeService.deleteProfileImage();
  }
}