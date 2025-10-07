import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input'
import { LoginResponse } from './dto/login.response'

@Resolver()
export class AuthResolver {
    constructor( private readonly authService: AuthService){}

    @Mutation(()=> LoginResponse)
    async login(@Args('input') input: LoginInput) {
        return this.authService.login(input)
    }
}
