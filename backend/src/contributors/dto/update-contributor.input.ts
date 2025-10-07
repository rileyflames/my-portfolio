import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsNotEmpty, IsEmail } from 'class-validator';

/**
 * Input type for updating an existing contributor
 * All fields are optional since we might only want to update specific fields
 */
@InputType()
export class UpdateContributorInput {
  // Contributor's name (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Contributor name cannot be empty' })
  name?: string;

  // Contributor's email (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  // GitHub profile (optional for updates)
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'GitHub profile cannot be empty' })
  github?: string;
}