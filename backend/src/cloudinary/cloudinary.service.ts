import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {}

  /**
   * Get Cloudinary configuration for frontend
   * Only returns public information (cloud name and upload preset)
   */
  getConfig() {
    return {
      cloudName: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      uploadPreset: this.configService.get<string>('CLOUDINARY_UPLOAD_PRESET'),
    };
  }

  /**
   * Generate upload signature for secure uploads (optional, for future use)
   */
  generateSignature(paramsToSign: Record<string, any>): string {
    // This would use the API secret to sign uploads
    // For now, we're using unsigned uploads
    return '';
  }
}
