import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Security Headers Middleware
 * 
 * PURPOSE: Adds security headers to all HTTP responses
 * 
 * SECURITY BENEFITS:
 * - Prevents clickjacking attacks (X-Frame-Options)
 * - Prevents MIME type sniffing (X-Content-Type-Options)
 * - Enables XSS protection (X-XSS-Protection)
 * - Enforces HTTPS (Strict-Transport-Security)
 * - Controls resource loading (Content-Security-Policy)
 */
@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Prevent clickjacking - don't allow site to be embedded in iframes
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection in older browsers
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Enforce HTTPS for 1 year (only in production)
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    
    // Content Security Policy - restrict resource loading
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    );
    
    // Remove X-Powered-By header to hide technology stack
    res.removeHeader('X-Powered-By');
    
    next();
  }
}
