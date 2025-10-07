import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as argon2 from 'argon2';



@Injectable()
export class UserService {

	constructor( 
		// inject the TypeORM repo for the User entity
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	){}

	// Find all users in the database
	async findAll(): Promise<User[]> {
		return this.userRepository.find()
	}

	// get one user
	async findOne(id: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id: id } });
		if (!user) {
			throw new NotFoundException(`User with id ${id} not found`);
		}
		return user;
	}



	// Helper method to hash a password
	private async hashPassword(password: string): Promise<string> {
		return argon2.hash(password);
	}

	// create a new user and save to database
	async create(createUserInput: CreateUserInput): Promise<User> {
		// Hash the password before saving
		const hashedPassword = await this.hashPassword(createUserInput.password);
		// Create a new user object with the hashed password
		const newUser = this.userRepository.create({
			...createUserInput,
			password: hashedPassword,
		});
		return this.userRepository.save(newUser);
	}

	// update a user by id
	async update(id: string, updateUserInput: UpdateUserInput): Promise<User | null> {
		// Find the user by id
		const user = await this.userRepository.findOne({ where: { id: id.toString() } });
		if (!user) {
			// If user not found, return null
			return null;
		}
		// If password is being updated, hash it first
		if (updateUserInput.password) {
			updateUserInput.password = await this.hashPassword(updateUserInput.password);
		}
		// Merge the update data into the user
		Object.assign(user, updateUserInput);
		// Save the updated user
		return this.userRepository.save(user);
	}

	// delete a user by id
	async remove(id: string): Promise<boolean> {
		// Delete the user from the database
		const result = await this.userRepository.delete(id.toString());
		// If affected > 0, the user was deleted
		return (result.affected ?? 0) > 0;
	}

}