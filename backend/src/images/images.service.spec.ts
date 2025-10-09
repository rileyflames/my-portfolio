import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ImagesService } from './images.service';
import { Image } from './entities/image.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ImagesService', () => {
  let service: ImagesService;
  let mockRepository: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      })),
    };

    mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          CLOUDINARY_CLOUD_NAME: 'test-cloud',
          CLOUDINARY_API_KEY: 'test-key',
          CLOUDINARY_API_SECRET: 'test-secret',
        };
        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: getRepositoryToken(Image),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateFile', () => {
    it('should throw BadRequestException if file is too large', async () => {
      const largeFile = {
        size: 11 * 1024 * 1024, // 11MB
        mimetype: 'image/jpeg',
        originalname: 'test.jpg',
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      await expect(
        service.uploadImage(largeFile, {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid mime type', async () => {
      const invalidFile = {
        size: 1024,
        mimetype: 'application/pdf',
        originalname: 'test.pdf',
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      await expect(
        service.uploadImage(invalidFile, {}),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteImage', () => {
    it('should throw NotFoundException if image does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteImage('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findImages', () => {
    it('should return paginated results', async () => {
      const result = await service.findImages({ page: 1, limit: 10 });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
    });
  });
});
