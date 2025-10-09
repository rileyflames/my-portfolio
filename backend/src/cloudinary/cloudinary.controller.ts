import { Controller, Get } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * GET /cloudinary/config
   * Returns Cloudinary configuration for frontend uploads
   */
  @Get('config')
  getConfig() {
    return this.cloudinaryService.getConfig();
  }
}
