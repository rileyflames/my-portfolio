import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

/**
 * Admin IP Whitelist Guard
 * 
 * PURPOSE: Restricts admin access to specific IP addresses
 * 
 * SECURITY BENEFIT: Even if someone gets admin credentials,
 * they can't login unless they're on an approved IP address
 * 
 * SETUP: Add ADMIN_WHITELIST_IPS to .env file:
 * ADMIN_WHITELIST_IPS=127.0.0.1,192.168.1.100,YOUR_OFFICE_IP
 * 
 * Set to empty or "*" to disable IP whitelisting
 */
@Injectable()
export class AdminIpWhitelistGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    // Get client IP address
    const clientIp = this.getClientIp(request);
    
    // Get whitelisted IPs from environment
    const whitelistStr = this.configService.get<string>('ADMIN_WHITELIST_IPS', '');
    
    // If whitelist is empty or "*", allow all IPs (disabled)
    if (!whitelistStr || whitelistStr === '*') {
      return true;
    }
    
    // Parse whitelist
    const whitelist = whitelistStr.split(',').map(ip => ip.trim());
    
    // Check if client IP is in whitelist
    if (!whitelist.includes(clientIp)) {
      console.warn(`Admin access denied from IP: ${clientIp}`);
      throw new ForbiddenException('Access denied from this IP address');
    }
    
    return true;
  }

  /**
   * Get client IP address, handling proxies
   */
  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }
}
