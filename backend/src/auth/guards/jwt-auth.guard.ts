import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * JWT Authentication Guard
 * 
 * PURPOSE: This guard protects routes by verifying that the user has a valid JWT token.
 * 
 * HOW IT WORKS:
 * 1. Intercepts incoming requests before they reach the resolver/controller
 * 2. Extracts the JWT token from the Authorization header
 * 3. Validates the token using the JWT strategy
 * 4. If valid, allows the request to proceed
 * 5. If invalid or missing, returns 401 Unauthorized
 * 
 * SECURITY BENEFIT: Prevents unauthorized users from accessing protected endpoints
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Convert HTTP context to GraphQL context
   * This is necessary because we're using GraphQL instead of REST
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
