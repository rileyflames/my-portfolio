import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';

/**
 * Input type for creating a new message
 * This is used when visitors submit the contact form on your portfolio
 */
@InputType()
export class CreateMessageInput {
  // Sender's full name
  @Field()
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  fullName: string;

  // Sender's email address
  @Field()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string;

  // Sender's city/location
  @Field()
  @IsNotEmpty({ message: 'City is required' })
  @MaxLength(100, { message: 'City must not exceed 100 characters' })
  @MinLength(2, { message: 'City must be at least 2 characters' })
  city: string;

  // Message subject
  @Field()
  @IsNotEmpty({ message: 'Subject is required' })
  @MaxLength(200, { message: 'Subject must not exceed 200 characters' })
  @MinLength(5, { message: 'Subject must be at least 5 characters' })
  subject: string;

  // Message content/description
  @Field()
  @IsNotEmpty({ message: 'Message description is required' })
  @MaxLength(2000, { message: 'Message must not exceed 2000 characters' })
  @MinLength(10, { message: 'Message must be at least 10 characters' })
  messageDescription: string;
}