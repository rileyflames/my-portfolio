import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { UserModule } from "src/users/user.module";


@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret : process.env.JWT_SECRET ,
      signOptions : { expiresIn: '1h'}
    })
  ],
  providers: [ AuthService, AuthResolver]
})
export class AuthModule {}