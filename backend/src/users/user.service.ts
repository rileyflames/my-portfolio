import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as argon2 from 'argon2';

/**
 * UserService handles all user-related business logic
 * This service interacts with the database through TypeORM repository
 */
@Injectable()
export class UserService {

	constructor( 
		// Inject the TypeORM repository for the User entity
		// This gives us access to database operations for users
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	){}

	/**
	 * Retrieves all users from the database
	 * @returns Promise<User[]> - Array of all users
	 */
	async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	/**
	 * Finds a single user by their ID
	 * @param id - The user's unique identifier
	 * @returns Promise<User> - The user object
	 * @throws NotFoundException if user doesn't exist
	 */
	async findOne(id: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id: id } });
		if (!user) {
			throw new NotFoundException(`User with id ${id} not found`);
		}
		return user;
	}

	/**
	 * Finds a user by their ID (alias for findOne, used by JWT strategy)
	 * @param id - The user's unique identifier
	 * @returns Promise<User | null> - User object or null if not found
	 */
	async findById(id: string): Promise<User | null> {
		return this.userRepository.findOne({ where: { id: id } });
	}

	/**
	 * Finds a user by their email address (used for authentication)
	 * @param email - The user's email address
	 * @returns Promise<User | null> - User object or null if not found
	 */
	async findByEmail(email: string): Promise<User | null> {
		return this.userRepository.findOne({ where: { email } });
	}

	/**
	 * Private helper method to hash passwords using Argon2
	 * Argon2 is a secure password hashing algorithm
	 * @param password - Plain text password
	 * @returns Promise<string> - Hashed password
	 */
	private async hashPassword(password: string): Promise<string> {
		return argon2.hash(password);
	}

	/**
	 * Creates a new user in the database
	 * @param createUserInput - User data from the GraphQL input
	 * @returns Promise<User> - The created user object
	 * @throws ConflictException if email already exists
	 */
	async create(createUserInput: CreateUserInput): Promise<User> {
		// Check if user with this email already exists
		const existingUser = await this.findByEmail(createUserInput.email);
		if (existingUser) {
			throw new ConflictException('User with this email already exists');
		}

		// Hash the password before saving to database
		// Never store plain text passwords!
		const hashedPassword = await this.hashPassword(createUserInput.password);
		
		// Create a new user object with the hashed password
		// The spread operator (...) copies all properties from createUserInput
		const newUser = this.userRepository.create({
			...createUserInput,
			password: hashedPassword,
		});
		
		// Save the user to the database and return the result
		return this.userRepository.save(newUser);
	}

	/**
	 * Updates an existing user's information
	 * @param id - The user's ID to update
	 * @param updateUserInput - Updated user data
	 * @returns Promise<User | null> - Updated user or null if not found
	 */
	async update(id: string, updateUserInput: UpdateUserInput): Promise<User | null> {
		// First, find the user by ID
		const user = await this.userRepository.findOne({ where: { id: id } });
		if (!user) {
			// Return null if user doesn't exist
			return null;
		}
		
		// If password is being updated, hash it first
		if (updateUserInput.password) {
			updateUserInput.password = await this.hashPassword(updateUserInput.password);
		}
		
		// Merge the update data into the existing user object
		// Object.assign copies properties from updateUserInput to user
		Object.assign(user, updateUserInput);
		
		// Save the updated user to the database
		return this.userRepository.save(user);
	}

	/**
	 * Deletes a user from the database
	 * @param id - The user's ID to delete
	 * @returns Promise<boolean> - True if deleted, false if not found
	 */
	async remove(id: string): Promise<boolean> {
		// Attempt to delete the user from the database
		const result = await this.userRepository.delete(id);
		
		// Check if any rows were affected (deleted)
		// The ?? operator provides a default value if affected is undefined
		return (result.affected ?? 0) > 0;
	}
}