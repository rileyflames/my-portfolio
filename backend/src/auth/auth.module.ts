import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { UserModule } from "src/users/user.module";

@Module({
  imports: [
    // Import UserModule to access UserService
    UserModule,
    
    // Configure JWT module asynchronously to access environment variables
    // This ensures the JWT_SECRET is properly loaded from .env file
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to access environment variables
      inject: [ConfigService], // Inject ConfigService to read from .env
      useFactory: (configService: ConfigService) => ({
        // Get JWT secret from environment variables
        secret: configService.get<string>('JWT_SECRET'),
        // Set token expiration time
        signOptions: { expiresIn: '1h' }
      }),
    })
  ],
  providers: [AuthService, AuthResolver]
})
export class AuthModule {}