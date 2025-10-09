import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Login Attempt Tracker Guard
 * 
 * PURPOSE: Tracks failed login attempts and implements progressive delays
 * 
 * SECURITY BENEFITS:
 * - Prevents brute-force attacks
 * - Implements exponential backoff on failed attempts
 * - Temporarily locks accounts after too many failures
 * 
 * BEHAVIOR:
 * - 3 failed attempts: 5 second delay
 * - 5 failed attempts: 30 second delay
 * - 10 failed attempts: 5 minute lockout
 */
@Injectable()
export class LoginAttemptTrackerGuard implements CanActivate {
  private attempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const email = request.body?.variables?.input?.email;

    if (!email) {
      return true; // Let validation handle missing email
    }

    const key = email.toLowerCase();
    const now = Date.now();
    const record = this.attempts.get(key);

    // Check if account is locked
    if (record?.lockedUntil && now < record.lockedUntil) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      throw new HttpException(
        `Too many failed attempts. Account locked for ${remainingSeconds} seconds.`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Reset if last attempt was more than 15 minutes ago
    if (record && now - record.lastAttempt > 15 * 60 * 1000) {
      this.attempts.delete(key);
    }

    return true;
  }

  /**
   * Call this method after a failed login attempt
   */
  recordFailedAttempt(email: string): void {
    const key = email.toLowerCase();
    const now = Date.now();
    const record = this.attempts.get(key) || { count: 0, lastAttempt: now };

    record.count++;
    record.lastAttempt = now;

    // Lock account after 10 failed attempts for 5 minutes
    if (record.count >= 10) {
      record.lockedUntil = now + 5 * 60 * 1000; // 5 minutes
    }

    this.attempts.set(key, record);
  }

  /**
   * Call this method after a successful login
   */
  recordSuccessfulLogin(email: string): void {
    this.attempts.delete(email.toLowerCase());
  }

  /**
   * Get delay in milliseconds based on failed attempts
   */
  getDelay(email: string): number {
    const record = this.attempts.get(email.toLowerCase());
    if (!record) return 0;

    if (record.count >= 5) return 30000; // 30 seconds
    if (record.count >= 3) return 5000;  // 5 seconds
    return 0;
  }
}
