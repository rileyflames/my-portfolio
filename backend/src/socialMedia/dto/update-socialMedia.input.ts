import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsNotEmpty, IsUrl } from 'class-validator';

/**
 * Input type for updating an existing social media link
 * All fields are optional since we might only want to update specific fields
 */
@InputType()
export class UpdateSocialMediaInput {
  // Display name (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Social media name cannot be empty' })
  name?: string;

  // Profile URL (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Link must be a valid URL' })
  link?: string;

  // Icon (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Icon cannot be empty' })
  icon?: string;
}