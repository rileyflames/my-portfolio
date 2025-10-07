import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsNotEmpty, IsUrl, IsArray, IsEnum } from 'class-validator';

/**
 * Input type for updating an existing project
 * All fields are optional since we might only want to update specific fields
 */
@InputType()
export class UpdateProjectInput {
  // Project name (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Project name cannot be empty' })
  name?: string;

  // GitHub repository link (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'GitHub link must be a valid URL' })
  githubLink?: string;

  // Live/demo URL (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Live URL must be a valid URL' })
  liveUrl?: string;

  // Project status/progress (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(['pending', 'in-progress', 'finished'], {
    message: 'Progress must be pending, in-progress, or finished'
  })
  progress?: 'pending' | 'in-progress' | 'finished';

  // Project image URL (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;

  // Project description (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Project description cannot be empty' })
  description?: string;

  // Array of technology IDs (optional for updates)
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  technologyIds?: string[];

  // Array of tags (optional for updates)
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: string[];

  // Array of contributor IDs (optional for updates)
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  contributorIds?: string[];

  // ID of the user editing this project (optional)
  @Field({ nullable: true })
  @IsOptional()
  editedById?: string;
}