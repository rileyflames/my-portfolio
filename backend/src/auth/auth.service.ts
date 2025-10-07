import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/users/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        // Inject UserService to access user-related operations
        private userService: UserService,
        // Inject JwtService to create and verify JWT tokens
        private jwtService: JwtService
    ) { }

    /**
     * Validates a user's credentials (email and password)
     * @param email - User's email address
     * @param password - User's plain text password
     * @returns User object without password if valid, null if invalid
     */
    async validateUser(email: string, password: string): Promise<any> {
        // Find user by email in the database
        const user = await this.userService.findByEmail(email);

        // If user exists and password is correct
        if (user && await argon2.verify(user.password, password)) {
            // Remove password from user object before returning
            // This is important for security - never return passwords
            const { password, ...result } = user;
            return result;
        }

        // Return null if user doesn't exist or password is wrong
        return null;
    }

    /**
     * Handles user login process
     * @param input - Object containing email and password
     * @returns Object with access_token and user information
     * @throws UnauthorizedException if credentials are invalid
     */
    async login(input: { email: string, password: string }) {
        // Find user by email
        const user = await this.userService.findByEmail(input.email);
        if (!user) {
            // Throw proper HTTP exception instead of generic Error
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify the provided password against the stored hash
        const valid = await argon2.verify(user.password, input.password);
        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Create JWT payload with user information
        // 'sub' is a standard JWT claim meaning 'subject' (user ID)
        const payload = { email: user.email, sub: user.id };

        // Return the access token and user information
        // This matches the LoginResponse structure
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
        };
    }
}
