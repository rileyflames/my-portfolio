import { Injectable } from '@nestjs/common';
import * as validator from 'validator';

/**
 * Input Sanitizer Service
 * 
 * PURPOSE: Prevents XSS, SQL injection, and NoSQL injection attacks
 * by sanitizing and validating all user inputs
 * 
 * SECURITY BENEFITS:
 * - Removes dangerous HTML/JavaScript from inputs
 * - Validates email formats
 * - Prevents NoSQL injection in MongoDB queries
 * - Sanitizes strings before database operations
 */
@Injectable()
export class InputSanitizerService {
  /**
   * Sanitize string input to prevent XSS attacks
   * Removes HTML tags and dangerous characters
   */
  sanitizeString(input: string): string {
    if (!input) return input;
    
    // Remove HTML tags and escape special characters
    return validator.escape(validator.stripLow(input.trim()));
  }

  /**
   * Sanitize email input
   * Validates email format and normalizes it
   */
  sanitizeEmail(email: string): string {
    if (!email) return email;
    
    const trimmed = email.trim().toLowerCase();
    
    // Validate email format
    if (!validator.isEmail(trimmed)) {
      throw new Error('Invalid email format');
    }
    
    return validator.normalizeEmail(trimmed) || trimmed;
  }

  /**
   * Sanitize URL input
   * Validates URL format and prevents javascript: and data: URLs
   */
  sanitizeUrl(url: string): string {
    if (!url) return url;
    
    const trimmed = url.trim();
    
    // Block dangerous URL schemes
    if (trimmed.match(/^(javascript|data|vbscript):/i)) {
      throw new Error('Invalid URL scheme');
    }
    
    // Validate URL format
    if (!validator.isURL(trimmed, { protocols: ['http', 'https'], require_protocol: true })) {
      throw new Error('Invalid URL format');
    }
    
    return trimmed;
  }

  /**
   * Sanitize object for MongoDB queries
   * Prevents NoSQL injection by removing $ operators
   */
  sanitizeMongoQuery(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeMongoQuery(item));
    }

    const sanitized: any = {};
    for (const key in obj) {
      // Remove keys starting with $ (MongoDB operators)
      if (key.startsWith('$')) {
        continue;
      }
      
      sanitized[key] = this.sanitizeMongoQuery(obj[key]);
    }

    return sanitized;
  }

  /**
   * Validate and sanitize numeric input
   */
  sanitizeNumber(input: any, min?: number, max?: number): number {
    const num = Number(input);
    
    if (isNaN(num)) {
      throw new Error('Invalid number format');
    }
    
    if (min !== undefined && num < min) {
      throw new Error(`Number must be at least ${min}`);
    }
    
    if (max !== undefined && num > max) {
      throw new Error(`Number must be at most ${max}`);
    }
    
    return num;
  }
}
