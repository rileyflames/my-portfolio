import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SocialMedia } from './entities/socialMedia.entity';
import { SocialMediaService } from './socialMedia.service';
import { CreateSocialMediaInput } from './dto/create-socialMedia.input';
import { UpdateSocialMediaInput } from './dto/update-socialMedia.input';

/**
 * SocialMediaResolver handles GraphQL queries and mutations for social media links
 * This manages social media profiles linked to the AboutMe entity
 */
@Resolver(() => SocialMedia)
export class SocialMediaResolver {
  constructor(
    private readonly socialMediaService: SocialMediaService
  ) {}

  /**
   * GraphQL Query: Get all social media links
   * Query: { 
   *   socialMediaLinks { 
   *     id name link icon 
   *     aboutMe { fullName }
   *   } 
   * }
   */
  @Query(() => [SocialMedia], { 
    name: 'socialMediaLinks',
    description: 'Get all social media links' 
  })
  async getAllSocialMediaLinks(): Promise<SocialMedia[]> {
    return this.socialMediaService.findAll();
  }

  /**
   * GraphQL Query: Get social media links for AboutMe
   * Query: { 
   *   mySocialMediaLinks { 
   *     id name link icon 
   *   } 
   * }
   */
  @Query(() => [SocialMedia], {
    name: 'mySocialMediaLinks',
    description: 'Get social media links for the AboutMe profile'
  })
  async getMySocialMediaLinks(): Promise<SocialMedia[]> {
    return this.socialMediaService.findByAboutMe();
  }

  /**
   * GraphQL Query: Get a single social media link by ID
   * Query: { 
   *   socialMediaLink(id: "uuid") { 
   *     id name link icon 
   *   } 
   * }
   */
  @Query(() => SocialMedia, { 
    name: 'socialMediaLink',
    description: 'Get a single social media link by ID',
    nullable: true 
  })
  async getSocialMediaLink(@Args('id') id: string): Promise<SocialMedia> {
    return this.socialMediaService.findOne(id);
  }

  /**
   * GraphQL Mutation: Create a new social media link
   * Mutation: { 
   *   createSocialMediaLink(input: { 
   *     name: "Twitter", 
   *     link: "https://twitter.com/username",
   *     icon: "twitter-icon"
   *   }) {
   *     id name link icon
   *   }
   * }
   */
  @Mutation(() => SocialMedia, {
    description: 'Create a new social media link'
  })
  async createSocialMediaLink(
    @Args('input') createSocialMediaInput: CreateSocialMediaInput
  ): Promise<SocialMedia> {
    return this.socialMediaService.create(createSocialMediaInput);
  }

  /**
   * GraphQL Mutation: Update an existing social media link
   * Mutation: {
   *   updateSocialMediaLink(id: "uuid", input: { 
   *     name: "X (Twitter)",
   *     link: "https://x.com/username"
   *   }) {
   *     id name link icon updatedAt
   *   }
   * }
   */
  @Mutation(() => SocialMedia, {
    description: 'Update an existing social media link'
  })
  async updateSocialMediaLink(
    @Args('id') id: string,
    @Args('input') updateSocialMediaInput: UpdateSocialMediaInput
  ): Promise<SocialMedia> {
    return this.socialMediaService.update(id, updateSocialMediaInput);
  }

  /**
   * GraphQL Mutation: Delete a social media link
   * Mutation: { deleteSocialMediaLink(id: "uuid") }
   */
  @Mutation(() => Boolean, {
    description: 'Delete a social media link'
  })
  async deleteSocialMediaLink(@Args('id') id: string): Promise<boolean> {
    return this.socialMediaService.remove(id);
  }
}