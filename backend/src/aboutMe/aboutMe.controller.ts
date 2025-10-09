import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AboutMeService } from './aboutMe.service';
import { AboutMe } from './entities/aboutMe.entity';

@Controller('aboutme')
export class AboutMeController {
  constructor(private readonly aboutMeService: AboutMeService) {}

  /**
   * Upload or replace profile image for AboutMe
   * POST /aboutme/image
   */
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AboutMe> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.aboutMeService.uploadProfileImage(file);
  }

  /**
   * Delete profile image from AboutMe
   * DELETE /aboutme/image
   */
  @Delete('image')
  async deleteProfileImage(): Promise<AboutMe> {
    return this.aboutMeService.deleteProfileImage();
  }
}
