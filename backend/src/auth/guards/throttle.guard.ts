import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Custom Throttle Guard for GraphQL
 * 
 * PURPOSE: Rate limiting to prevent brute-force attacks on login endpoint
 * 
 * HOW IT WORKS:
 * - Limits number of requests from same IP address
 * - Default: 5 requests per 60 seconds (configured in app.module.ts)
 * - Blocks additional requests with 429 Too Many Requests error
 * 
 * SECURITY BENEFIT: Prevents attackers from trying thousands of password combinations
 * 
 * EXAMPLE: If someone tries to login with wrong password 5 times,
 * they must wait 60 seconds before trying again
 */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  /**
   * Convert GraphQL context to HTTP context for rate limiting
   */
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return { req: ctx.req, res: ctx.res };
  }
}
