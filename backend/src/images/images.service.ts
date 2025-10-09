import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Image } from './entities/image.entity';
import { UploadImageDto } from './dto/upload-image.dto';
import { QueryImagesDto } from './dto/query-images.dto';
import * as streamifier from 'streamifier';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
  ];
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly configService: ConfigService,
  ) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Upload image to Cloudinary and save record to database
   */
  async uploadImage(
    file: Express.Multer.File,
    uploadDto: UploadImageDto,
  ): Promise<Image> {
    // Validate file
    this.validateFile(file);

    try {
      // Upload to Cloudinary
      const cloudinaryResult = await this.uploadToCloudinary(file);

      // Save to database
      const image = this.imageRepository.create({
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url,
        filename: file.originalname,
        alt_text: uploadDto.alt_text,
        owner_id: uploadDto.owner_id,
        project_id: uploadDto.project_id,
      });

      return await this.imageRepository.save(image);
    } catch (error) {
      this.logger.error('Failed to upload image', error);
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  /**
   * Get images with optional filtering
   */
  async findImages(queryDto: QueryImagesDto): Promise<{
    data: Image[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { ownerId, projectId, page = 1, limit = 50 } = queryDto;

    const queryBuilder = this.imageRepository.createQueryBuilder('image');

    if (ownerId) {
      queryBuilder.andWhere('image.owner_id = :ownerId', { ownerId });
    }

    if (projectId) {
      queryBuilder.andWhere('image.project_id = :projectId', { projectId });
    }

    queryBuilder
      .orderBy('image.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Delete image from both Cloudinary and database (atomic operation)
   */
  async deleteImage(id: string): Promise<void> {
    // Find image record
    const image = await this.imageRepository.findOne({ where: { id } });

    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    try {
      // Step 1: Delete from Cloudinary first
      this.logger.log(`Deleting image from Cloudinary: ${image.public_id}`);
      const cloudinaryResult = await cloudinary.uploader.destroy(
        image.public_id,
      );

      if (cloudinaryResult.result !== 'ok' && cloudinaryResult.result !== 'not found') {
        throw new Error(
          `Cloudinary deletion failed: ${cloudinaryResult.result}`,
        );
      }

      // Step 2: Delete from database only if Cloudinary deletion succeeded
      this.logger.log(`Deleting image from database: ${id}`);
      await this.imageRepository.remove(image);

      this.logger.log(`Successfully deleted image: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete image ${id}`, error);

      // If Cloudinary deletion succeeded but DB deletion failed, log critical error
      if (error.message && !error.message.includes('Cloudinary')) {
        this.logger.error(
          `CRITICAL: Image deleted from Cloudinary but DB deletion failed for ${id}`,
        );
      }

      throw new InternalServerErrorException(
        `Failed to delete image: ${error.message}`,
      );
    }
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    // Check mime type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }
  }

  /**
   * Upload file to Cloudinary
   */
  private uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<{ public_id: string; secure_url: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',
          resource_type: 'image',
          transformation: [
            { width: 2000, height: 2000, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary upload error', error);
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Upload failed: no result'));
          }
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
