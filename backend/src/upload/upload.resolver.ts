import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UploadService } from './upload.service';
import type { FileUpload } from './upload.service';
import { GraphQLUpload } from './scalars/upload.scalar';

@Resolver()
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Upload a profile image
   * Mutation: uploadProfileImage(file: Upload!)
   */
  @Mutation(() => String, {
    description: 'Upload a profile image for AboutMe'
  })
  async uploadProfileImage(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload
  ): Promise<string> {
    return this.uploadService.uploadImage(file, 'profiles');
  }

  /**
   * Upload a project image
   * Mutation: uploadProjectImage(file: Upload!)
   */
  @Mutation(() => String, {
    description: 'Upload an image for a project'
  })
  async uploadProjectImage(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload
  ): Promise<string> {
    return this.uploadService.uploadImage(file, 'projects');
  }

  /**
   * Upload a technology icon
   * Mutation: uploadTechnologyIcon(file: Upload!)
   */
  @Mutation(() => String, {
    description: 'Upload an icon for a technology'
  })
  async uploadTechnologyIcon(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload
  ): Promise<string> {
    return this.uploadService.uploadImage(file, 'technologies');
  }

  /**
   * Upload a general image
   * Mutation: uploadImage(file: Upload!, folder: String)
   */
  @Mutation(() => String, {
    description: 'Upload a general image file'
  })
  async uploadImage(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
    @Args('folder', { nullable: true }) folder?: string
  ): Promise<string> {
    return this.uploadService.uploadImage(file, folder);
  }
}