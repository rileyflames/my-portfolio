import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUrl } from 'class-validator';

/**
 * Input type for creating a new social media link
 * Social media links are associated with the AboutMe entity
 */
@InputType()
export class CreateSocialMediaInput {
  // Display name (e.g., "Twitter", "LinkedIn", "GitHub")
  @Field()
  @IsNotEmpty({ message: 'Social media name is required' })
  name: string;

  // URL to the social media profile
  @Field()
  @IsUrl({}, { message: 'Link must be a valid URL' })
  link: string;

  // Icon URL or icon identifier
  @Field()
  @IsNotEmpty({ message: 'Icon is required' })
  icon: string;
}