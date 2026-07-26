"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
const sharp_1 = __importDefault(require("sharp"));
let MediaService = class MediaService {
    prisma;
    uploadDir = path.join(process.cwd(), 'uploads');
    thumbnailDir = path.join(this.uploadDir, 'thumbnails');
    allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    maxFileSize = 10 * 1024 * 1024;
    constructor(prisma) {
        this.prisma = prisma;
        this.ensureUploadDirectories();
    }
    async ensureUploadDirectories() {
        try {
            await fs.mkdir(this.uploadDir, { recursive: true });
            await fs.mkdir(this.thumbnailDir, { recursive: true });
        }
        catch (error) {
            console.error('Error creating upload directories:', error);
        }
    }
    async uploadMedia(file, type, userId, altText, title) {
        this.validateFile(file, type);
        const fileExtension = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
        const filePath = path.join(this.uploadDir, fileName);
        await fs.writeFile(filePath, file.buffer);
        let width;
        let height;
        let thumbnail;
        if (type === 'image') {
            const metadata = await (0, sharp_1.default)(file.buffer).metadata();
            width = metadata.width;
            height = metadata.height;
            const thumbnailFileName = `thumb-${fileName}`;
            const thumbnailPath = path.join(this.thumbnailDir, thumbnailFileName);
            await (0, sharp_1.default)(file.buffer)
                .resize(300, 300, { fit: 'cover' })
                .toFile(thumbnailPath);
            thumbnail = `/uploads/thumbnails/${thumbnailFileName}`;
        }
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
    validateFile(file, type) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException('File size exceeds maximum limit of 10MB');
        }
        if (type === 'image') {
            if (!this.allowedImageTypes.includes(file.mimetype)) {
                throw new common_1.BadRequestException('Invalid image type. Allowed types: JPEG, JPG, PNG, GIF, WebP');
            }
        }
        else if (type === 'video') {
            if (!this.allowedVideoTypes.includes(file.mimetype)) {
                throw new common_1.BadRequestException('Invalid video type. Allowed types: MP4, WebM, OGG');
            }
        }
        else {
            throw new common_1.BadRequestException('Invalid media type. Allowed types: image, video');
        }
    }
    async getAllMedia(page = 1, limit = 20, type, search) {
        const skip = (page - 1) * limit;
        const where = {};
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
    async getMediaById(id) {
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
            throw new common_1.NotFoundException('Media not found');
        }
        return media;
    }
    async updateMedia(id, dto) {
        const media = await this.prisma.media.findUnique({
            where: { id },
        });
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
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
    async deleteMedia(id) {
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
            throw new common_1.NotFoundException('Media not found');
        }
        const totalUsage = Object.values(media._count).reduce((sum, count) => sum + count, 0);
        if (totalUsage > 0) {
            throw new common_1.BadRequestException('Cannot delete media that is being used');
        }
        try {
            await fs.unlink(media.storedPath);
            if (media.thumbnail) {
                const thumbnailPath = path.join(process.cwd(), media.thumbnail.replace(/^\//, ''));
                await fs.unlink(thumbnailPath);
            }
        }
        catch (error) {
            console.error('Error deleting physical files:', error);
        }
        await this.prisma.media.delete({
            where: { id },
        });
        return { message: 'Media deleted successfully' };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], MediaService);
//# sourceMappingURL=media.service.js.map