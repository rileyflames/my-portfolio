import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from 'src/users/entities/user.entity';

/**
 * Roles Guard
 * 
 * PURPOSE: This guard checks if the authenticated user has the required role(s)
 * to access a specific endpoint.
 * 
 * HOW IT WORKS:
 * 1. After JWT authentication passes, this guard checks the user's role
 * 2. Compares the user's role against the required roles (set via @Roles decorator)
 * 3. If user has one of the required roles, allows access
 * 4. If not, returns 403 Forbidden
 * 
 * SECURITY BENEFIT: Implements Role-Based Access Control (RBAC)
 * - Prevents regular users from accessing admin-only features
 * - Ensures only authorized roles can perform sensitive operations
 * 
 * EXAMPLE: An EDITOR can create projects, but only an ADMIN can delete users
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles from the @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are specified, allow access
    // This means the route is protected by JWT but not role-restricted
    if (!requiredRoles) {
      return true;
    }

    // Extract the user from the GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    // Check if user has one of the required roles
    // Returns true if user's role is in the requiredRoles array
    return requiredRoles.some((role) => user.role === role);
  }
}
