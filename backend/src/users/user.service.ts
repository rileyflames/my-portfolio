import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';



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
	async findOne(id: number): Promise <User|null > {
		return this.userRepository.findOne({ where: { id: id.toString() } });
	}



	// create a new user and save to database
	async create(createUserInput: CreateUserInput): Promise<User> {
		const newUser = this.userRepository.create(createUserInput);
		return this.userRepository.save(newUser)
	}


}