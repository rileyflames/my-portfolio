import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

// This represents the response structure when a user successfully logs in
@ObjectType()
export class LoginResponse {
  // The JWT access token that clients will use for authenticated requests
  @Field()
  access_token: string;

  // The user object containing user details (without password)
  // This matches what AuthService.login() actually returns
  @Field(() => User)
  user: User;
}
