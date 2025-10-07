import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';


// name, email, password, and optional role
import { UserRole } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
    // The user's name
    @Field()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    // The user's email address
    @Field()
    @IsEmail({}, { message: 'Email must be valid' })
    email: string;

    // The user's password
    @Field()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;

    // The user's role (optional, defaults to EDITOR)
    @Field(() => String, { nullable: true })
    @IsOptional()
    role?: UserRole;
}