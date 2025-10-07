import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsUrl } from 'class-validator';

/**
 * Input type for creating a new contributor
 * Contributors are people who have worked on projects
 */
@InputType()
export class CreateContributorInput {
  // Contributor's full name
  @Field()
  @IsNotEmpty({ message: 'Contributor name is required' })
  name: string;

  // Contributor's email address (must be unique)
  @Field()
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  // GitHub username or profile URL (must be unique)
  @Field()
  @IsNotEmpty({ message: 'GitHub profile is required' })
  github: string;
}