import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

/**
 * Roles Decorator
 * 
 * PURPOSE: Marks a resolver or controller method with required roles
 * 
 * USAGE:
 * @Roles(UserRole.ADMIN)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * async deleteUser() { ... }
 * 
 * This ensures only users with ADMIN role can call deleteUser()
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
