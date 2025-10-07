import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Resolver(() => User)
export class UserResolver {
	constructor (private readonly userService: UserService) {}

	// Query to get all users
	@Query( ()=> [User], { name: 'users'})
	async getAllUsers() {
		return this.userService.findAll()
	}

	// Query to get a single user by id
	@Query(() => User, { name: 'user', nullable: true })
	async getUser(@Args('id') id: string) {
		return this.userService.findOne(id);
	}

	// Mutation to create a new user
	@Mutation( ()=> User)
	async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
		return this.userService.create(createUserInput)
	}

	// Mutation to update a user
	@Mutation(() => User, { nullable: true })
	async updateUser(
		@Args('id') id: string,
		@Args('updateUserInput') updateUserInput: UpdateUserInput
	) {
		return this.userService.update(id, updateUserInput);
	}

	// Mutation to delete a user
	@Mutation(() => Boolean)
	async deleteUser(@Args('id') id: string) {
		return this.userService.remove(id);
	}
}