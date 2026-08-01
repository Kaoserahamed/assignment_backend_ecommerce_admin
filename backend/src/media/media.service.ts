import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateMediaDto } from './dto/update-media.dto';
import * as path from 'path';
import * as fs from 'fs/promises';
import sharp from 'sharp';

@Injectable()
export class MediaService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly thumbnailDir = path.join(this.uploadDir, 'thumbnails');
  private readonly allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  private readonly allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor(private readonly prisma: DatabaseService) {
    this.ensureUploadDirectories();
  }

  private async ensureUploadDirectories() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.mkdir(this.thumbnailDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directories:', error);
    }
  }

  async uploadMedia(file: Express.Multer.File, type: string, userId: string, altText?: string, title?: string) {
    // Validate file
    this.validateFile(file, type);

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Save file
    await fs.writeFile(filePath, file.buffer);

    let width: number | undefined;
    let height: number | undefined;
    let thumbnail: string | undefined;

    // Generate thumbnail for images
    if (type === 'image') {
      try {
        const metadata = await sharp(file.buffer).metadata();
        width = metadata.width;
        height = metadata.height;

        const thumbnailFileName = `thumb-${fileName}`;
        const thumbnailPath = path.join(this.thumbnailDir, thumbnailFileName);

        await sharp(file.buffer)
          .resize(300, 300, { fit: 'cover' })
          .toFile(thumbnailPath);

        thumbnail = `/uploads/thumbnails/${thumbnailFileName}`;
      } catch (sharpError) {
        console.error('Error generating thumbnail:', sharpError);
        // Continue without thumbnail if Sharp fails
        // This allows image uploads to work even if thumbnail generation fails
      }
    }

    // Save to database
    const media = await this.prisma.media.create({
      data: {
        fileName: file.originalname,
        storedPath: filePath,
        publicUrl: `/uploads/${fileName}`,
        mimeType: file.mimetype,
        type,
        size: file.size,
        width,
        height,
        thumbnail,
        altText,
        title,
        uploadedById: userId,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return media;
  }

  private validateFile(file: Express.Multer.File, type: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds maximum limit of 10MB');
    }

    if (type === 'image') {
      if (!this.allowedImageTypes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid image type. Allowed types: JPEG, JPG, PNG, GIF, WebP');
      }
    } else if (type === 'video') {
      if (!this.allowedVideoTypes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid video type. Allowed types: MP4, WebM, OGG');
      }
    } else {
      throw new BadRequestException('Invalid media type. Allowed types: image, video');
    }
  }

  async getAllMedia(page = 1, limit = 20, type?: string, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [media, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      data: media,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMediaById(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  async updateMedia(id: string, dto: UpdateMediaDto) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    const updated = await this.prisma.media.update({
      where: { id },
      data: dto,
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updated;
  }

  async deleteMedia(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            categories: true,
            brands: true,
            productMedia: true,
            variantMedia: true,
            attributeValues: true,
          },
        },
      },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    const totalUsage = Object.values(media._count).reduce((sum, count) => sum + count, 0);
    if (totalUsage > 0) {
      throw new BadRequestException('Cannot delete media that is being used');
    }

    // Delete physical files
    try {
      await fs.unlink(media.storedPath);
      if (media.thumbnail) {
        const thumbnailPath = path.join(process.cwd(), media.thumbnail.replace(/^\//, ''));
        await fs.unlink(thumbnailPath);
      }
    } catch (error) {
      console.error('Error deleting physical files:', error);
    }

    await this.prisma.media.delete({
      where: { id },
    });

    return { message: 'Media deleted successfully' };
  }
}
