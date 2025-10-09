import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { Projects } from './entities/project.entity';
import { Image } from '../images/entities/image.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Upload images to a project (up to 10 total)
   * POST /projects/:id/images
   */
  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files per upload
  async uploadProjectImages(
    @Param('id') projectId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Projects> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    return this.projectsService.uploadProjectImages(projectId, files);
  }

  /**
   * Delete a specific image from a project
   * DELETE /projects/:projectId/images/:imageId
   */
  @Delete(':projectId/images/:imageId')
  async deleteProjectImage(
    @Param('projectId') projectId: string,
    @Param('imageId') imageId: string,
  ): Promise<Projects> {
    return this.projectsService.deleteProjectImage(projectId, imageId);
  }

  /**
   * Get all images for a project
   * GET /projects/:id/images
   */
  @Post(':id/images/list')
  async getProjectImages(@Param('id') projectId: string): Promise<Image[]> {
    return this.projectsService.getProjectImages(projectId);
  }
}
