import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsDateString, IsUrl, IsOptional, IsArray } from 'class-validator';

/**
 * Input type for creating AboutMe information
 * This represents personal/professional information for the portfolio
 */
@InputType()
export class CreateAboutMeInput {
  // Full name
  @Field()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  // Date of birth (ISO string format)
  @Field()
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dob: string;

  // When started coding (ISO string format)
  @Field()
  @IsDateString({}, { message: 'Started coding date must be a valid date' })
  startedCoding: string;

  // Biography/description text
  @Field()
  @IsNotEmpty({ message: 'Biography is required' })
  bio: string;

  // Array of technology IDs representing skills
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  technologyIds?: string[];

  // Profile image URL (optional)
  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}