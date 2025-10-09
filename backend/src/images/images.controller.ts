import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { QueryImagesDto } from './dto/query-images.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * POST /api/images
   * Upload image to Cloudinary and save to database
   * 
   * SECURITY: Requires authentication + ADMIN/EDITOR role
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadImageDto,
  ) {
    return this.imagesService.uploadImage(file, uploadDto);
  }

  /**
   * GET /api/images
   * Get images with optional filtering
   * 
   * Query params:
   * - ownerId: Filter by owner
   * - projectId: Filter by project
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 50)
   */
  @Get()
  async getImages(@Query() queryDto: QueryImagesDto) {
    return this.imagesService.findImages(queryDto);
  }

  /**
   * DELETE /api/images/:id
   * Delete image from Cloudinary and database
   * 
   * SECURITY: Requires authentication + ADMIN/EDITOR role
   * 
   * This is an atomic operation:
   * 1. Deletes from Cloudinary first
   * 2. Only deletes from DB if Cloudinary deletion succeeds
   * 3. Returns error if either step fails
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(@Param('id') id: string) {
    await this.imagesService.deleteImage(id);
  }
}
