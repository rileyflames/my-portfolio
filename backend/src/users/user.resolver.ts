import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { CreateUserInput } from "./dto/create-user.input";




@Resolver(() => User)
export class UserResolver {
	constructor (private readonly userService: UserService) {}

	// Query to get all users
	@Query( ()=> [User], { name: 'users'})
	async getAllUsers() {
		return this.userService.findAll()
	}

	// get one user


	// mutation to create a new user
	@Mutation( ()=> User)
	async createUser(@Args('createUserInput')createUserInput: CreateUserInput) {
		return this.userService.create(createUserInput)
	}
}