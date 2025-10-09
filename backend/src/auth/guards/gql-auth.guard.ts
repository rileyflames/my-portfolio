import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * GraphQL JWT Authentication Guard
 * 
 * PURPOSE: Protects GraphQL resolvers by verifying JWT tokens
 * 
 * USAGE:
 * @UseGuards(GqlAuthGuard)
 * async protectedQuery() { ... }
 * 
 * SECURITY CHECKS:
 * 1. Extracts JWT token from Authorization header
 * 2. Validates token signature and expiration
 * 3. Loads user from database
 * 4. Attaches user to request context
 * 
 * This is an alias for JwtAuthGuard with a more descriptive name
 */
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  /**
   * Convert HTTP context to GraphQL context
   * This is necessary because we're using GraphQL instead of REST
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
