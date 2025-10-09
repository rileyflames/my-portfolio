import { Module } from '@nestjs/common';
import { InputSanitizerService } from './input-sanitizer.service';
import { SecurityHeadersMiddleware } from './security-headers.middleware';

/**
 * Security Module
 * 
 * Provides centralized security services:
 * - Input sanitization to prevent XSS and injection attacks
 * - Security headers middleware
 */
@Module({
  providers: [InputSanitizerService],
  exports: [InputSanitizerService],
})
export class SecurityModule {}
