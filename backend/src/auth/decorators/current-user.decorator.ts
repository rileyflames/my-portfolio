import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * CurrentUser Decorator
 * 
 * PURPOSE: Extracts the authenticated user from the request context
 * 
 * USAGE:
 * async createProject(@CurrentUser() user: User) {
 *   // user is automatically extracted from JWT token
 *   console.log(user.id, user.email, user.role);
 * }
 * 
 * SECURITY BENEFIT: 
 * - Provides type-safe access to authenticated user
 * - Eliminates need to manually extract user from request
 * - User is guaranteed to be authenticated (when used with JwtAuthGuard)
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
