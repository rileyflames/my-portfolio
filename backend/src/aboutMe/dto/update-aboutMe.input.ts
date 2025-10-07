import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsNotEmpty, IsDateString, IsUrl, IsArray } from 'class-validator';

/**
 * Input type for updating AboutMe information
 * All fields are optional since we might only want to update specific fields
 */
@InputType()
export class UpdateAboutMeInput {
  // Full name (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Full name cannot be empty' })
  fullName?: string;

  // Date of birth (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dob?: string;

  // When started coding (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Started coding date must be a valid date' })
  startedCoding?: string;

  // Biography text (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Biography cannot be empty' })
  bio?: string;

  // Technology IDs (optional for updates)
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  technologyIds?: string[];

  // Profile image URL (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}