import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}

@Injectable()
export class UploadService {
  private readonly uploadDir: string;
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: string[];

  constructor(private configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];

    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      if (!fs.existsSync(this.uploadDir)) {
        await mkdir(this.uploadDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }
  }

  /**
   * Upload a single image file
   * @param fileUpload - The file upload stream
   * @param folder - Optional subfolder (e.g., 'profiles', 'projects', 'technologies')
   * @returns Promise<string> - The file URL/path
   */
  async uploadImage(fileUpload: FileUpload, folder?: string): Promise<string> {
    const { filename, mimetype, createReadStream } = fileUpload;

    // Validate file type
    if (!this.allowedMimeTypes.includes(mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`
      );
    }

    // Generate unique filename
    const fileExtension = path.extname(filename);
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    
    // Create folder path if specified
    const uploadPath = folder 
      ? path.join(this.uploadDir, folder)
      : this.uploadDir;

    // Ensure folder exists
    if (!fs.existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    const filePath = path.join(uploadPath, uniqueFilename);
    const stream = createReadStream();

    try {
      // Convert stream to buffer
      const chunks: Buffer[] = [];
      let totalSize = 0;

      for await (const chunk of stream) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        totalSize += buffer.length;
        
        // Check file size limit
        if (totalSize > this.maxFileSize) {
          throw new BadRequestException(
            `File too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`
          );
        }
        
        chunks.push(buffer);
      }

      const buffer = Buffer.concat(chunks);
      
      // Write file to disk
      await writeFile(filePath, buffer);

      // Return the relative URL path
      const relativePath = folder 
        ? `/uploads/${folder}/${uniqueFilename}`
        : `/uploads/${uniqueFilename}`;

      return relativePath;

    } catch (error) {
      // Clean up file if it was partially written
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException('Failed to upload file');
    }
  }

  /**
   * Delete an uploaded file
   * @param fileUrl - The file URL/path to delete
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Convert URL to file path
      const filePath = path.join(process.cwd(), fileUrl.replace(/^\//, ''));
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      // Don't throw error for file deletion failures
    }
  }

  /**
   * Get file info
   * @param fileUrl - The file URL/path
   */
  getFileInfo(fileUrl: string): { exists: boolean; size?: number; mimetype?: string } {
    try {
      const filePath = path.join(process.cwd(), fileUrl.replace(/^\//, ''));
      
      if (!fs.existsSync(filePath)) {
        return { exists: false };
      }

      const stats = fs.statSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      
      let mimetype = 'application/octet-stream';
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          mimetype = 'image/jpeg';
          break;
        case '.png':
          mimetype = 'image/png';
          break;
        case '.gif':
          mimetype = 'image/gif';
          break;
        case '.webp':
          mimetype = 'image/webp';
          break;
        case '.svg':
          mimetype = 'image/svg+xml';
          break;
      }

      return {
        exists: true,
        size: stats.size,
        mimetype
      };
    } catch (error) {
      return { exists: false };
    }
  }
}