import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsBoolean, IsEmail } from 'class-validator';

/**
 * Input type for filtering messages in queries
 * Allows admins to filter messages by various criteria
 */
@InputType()
export class MessageFiltersInput {
  // Filter by read status (true = read, false = unread, undefined = all)
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'isRead must be a boolean value' })
  isRead?: boolean;

  // Filter by sender's email address
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  // Filter by sender's city
  @Field({ nullable: true })
  @IsOptional()
  city?: string;

  // Search in subject and message content (case-insensitive)
  @Field({ nullable: true })
  @IsOptional()
  searchTerm?: string;
}