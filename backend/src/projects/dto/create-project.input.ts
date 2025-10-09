import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUrl, IsOptional, IsArray, IsEnum } from 'class-validator';

/**
 * Input type for creating a new project
 * Contains all required and optional fields for project creation
 */
@InputType()
export class CreateProjectInput {
  // Project name (required)
  @Field()
  @IsNotEmpty({ message: 'Project name is required' })
  name: string;

  // GitHub repository link (required)
  @Field()
  @IsNotEmpty({ message: 'GitHub link is required' })
  @IsUrl({}, { message: 'GitHub link must be a valid URL' })
  githubLink: string;

  // Live/demo URL (optional)
  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Live URL must be a valid URL' })
  liveUrl?: string;

  // Project status/progress (required)
  @Field()
  @IsEnum(['pending', 'in-progress', 'finished'], {
    message: 'Progress must be pending, in-progress, or finished'
  })
  progress: 'pending' | 'in-progress' | 'finished';

  // Project image URL (optional) - featured/main image
  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;

  // Array of project images (optional) - gallery
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  images?: string[];

  // Project description (required)
  @Field()
  @IsNotEmpty({ message: 'Project description is required' })
  description: string;

  // Array of technology IDs (optional)
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  technologyIds?: string[];

  // Array of tags (optional)
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: string[];

  // Array of contributor IDs (optional)
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  contributorIds?: string[];

  // ID of the user creating this project (required)
  @Field()
  @IsNotEmpty({ message: 'Creator ID is required' })
  createdById: string;
}