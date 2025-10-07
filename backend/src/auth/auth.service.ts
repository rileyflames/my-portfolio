import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/users/user.service';
import * as argon2 from 'argon2';


@Injectable()
export class AuthService {
    constructor (
        private userService : UserService,
        private jwtService : JwtService
    ) {}

    // Validate user by email and password
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && await argon2.verify(user.password, password)) {
            // Exclude password from returned user object
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    // Login expects LoginInput with email and password
    async login(input: { email: string, password: string }) {
        const user = await this.userService.findByEmail(input.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const valid = await argon2.verify(user.password, input.password);
        if (!valid) {
            throw new Error('Invalid credentials');
        }
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
    }
}
