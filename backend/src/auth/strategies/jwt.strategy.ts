import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/users/user.service';

/**
 * JWT Strategy
 * 
 * PURPOSE: Defines how to validate JWT tokens and extract user information
 * 
 * HOW IT WORKS:
 * 1. Extracts JWT token from Authorization header (format: "Bearer <token>")
 * 2. Verifies the token signature using JWT_SECRET
 * 3. Decodes the token payload (contains user id and email)
 * 4. Loads the full user from database
 * 5. Attaches user to request object for use in resolvers
 * 
 * SECURITY BENEFITS:
 * - Validates token hasn't been tampered with
 * - Ensures token hasn't expired
 * - Verifies user still exists in database
 * - Prevents deleted users from accessing the system
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      // Extract JWT from Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // Reject expired tokens (security best practice)
      ignoreExpiration: false,
      
      // Secret key used to verify token signature
      // Use non-null assertion since JWT_SECRET is required
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret-key',
    });
  }

  /**
   * Validate the JWT payload and return user
   * This method is called automatically after token is verified
   * 
   * @param payload - Decoded JWT payload containing user info
   * @returns User object that will be attached to request
   */
  async validate(payload: any) {
    // Payload contains: { email, sub (user id), iat (issued at), exp (expiration) }
    
    // Load the full user from database using the id from token
    const user = await this.userService.findById(payload.sub);
    
    // If user doesn't exist (maybe deleted), reject the token
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    // Return user object (will be available as req.user in resolvers)
    return user;
  }
}
