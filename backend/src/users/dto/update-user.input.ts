
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

// This input type is used for updating a user
@InputType()
export class UpdateUserInput {
	// The user's name (optional)
	@Field({ nullable: true })
	@IsOptional()
	name?: string;

	// The user's email address (optional)
	@Field({ nullable: true })
	@IsOptional()
	@IsEmail({}, { message: 'Email must be valid' })
	email?: string;

	// The user's password (optional)
	@Field({ nullable: true })
	@IsOptional()
	@MinLength(8, { message: 'Password must be at least 8 characters' })
	password?: string;

	// The user's role (optional)
	@Field(() => String, { nullable: true })
	@IsOptional()
	role?: UserRole;
}
