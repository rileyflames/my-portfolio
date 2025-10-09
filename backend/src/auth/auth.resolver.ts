import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input'
import { LoginResponse } from './dto/login.response'
import { GqlThrottlerGuard } from './guards/throttle.guard';

/**
 * Auth Resolver
 * 
 * PURPOSE: Handles authentication-related GraphQL mutations
 * 
 * SECURITY MEASURES:
 * - Rate limiting on login to prevent brute-force attacks
 * - Input validation (email format, password length)
 * - Returns 401 Unauthorized for invalid credentials
 */
@Resolver()
export class AuthResolver {
    constructor( private readonly authService: AuthService){}

    /**
     * Login Mutation
     * 
     * SECURITY FEATURES:
     * - Rate limited: Max 5 attempts per 60 seconds per IP
     * - Validates email format and password length
     * - Returns generic error message (doesn't reveal if email exists)
     * - Generates JWT token only on successful authentication
     * 
     * @param input - Email and password
     * @returns JWT access token and user information
     */
    @UseGuards(GqlThrottlerGuard) // Apply rate limiting
    @Mutation(()=> LoginResponse)
    async login(@Args('input') input: LoginInput) {
        return this.authService.login(input)
    }
}
