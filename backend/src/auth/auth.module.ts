import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { UserModule } from "src/users/user.module";
import { SecurityModule } from "src/security/security.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LoginAttemptTrackerGuard } from "./guards/login-attempt-tracker.guard";
import { AdminIpWhitelistGuard } from "./guards/admin-ip-whitelist.guard";

/**
 * Auth Module
 * 
 * PURPOSE: Handles all authentication-related functionality
 * 
 * WHAT IT PROVIDES:
 * - Login mutation (AuthResolver)
 * - JWT token generation (AuthService)
 * - JWT token validation (JwtStrategy)
 * - Password verification (AuthService)
 * 
 * SECURITY FEATURES:
 * - JWT tokens with expiration
 * - Password hashing with argon2
 * - Token-based authentication
 * - Input sanitization to prevent injection attacks
 * - Login attempt tracking to prevent brute-force attacks
 * - IP whitelisting for admin access
 */
@Module({
  imports: [
    // Import UserModule to access UserService
    UserModule,
    
    // Import SecurityModule for input sanitization
    SecurityModule,
    
    // Import PassportModule for authentication strategies
    PassportModule,
    
    // Configure JWT module asynchronously to access environment variables
    // This ensures the JWT_SECRET is properly loaded from .env file
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to access environment variables
      inject: [ConfigService], // Inject ConfigService to read from .env
      useFactory: (configService: ConfigService) => ({
        // Get JWT secret from environment variables
        secret: configService.get<string>('JWT_SECRET'),
        // Set token expiration time (24 hours for better UX)
        signOptions: { expiresIn: '24h' }
      }),
    })
  ],
  providers: [
    AuthService, 
    AuthResolver,
    JwtStrategy, // Register JWT strategy for token validation
    LoginAttemptTrackerGuard, // Track failed login attempts
    AdminIpWhitelistGuard, // Restrict admin access by IP
  ],
  exports: [AuthService, LoginAttemptTrackerGuard, AdminIpWhitelistGuard] // Export for use in other modules
})
export class AuthModule {}