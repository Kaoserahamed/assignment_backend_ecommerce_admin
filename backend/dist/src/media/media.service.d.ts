import { DatabaseService } from '../database/database.service';
import { UpdateMediaDto } from './dto/update-media.dto';
export declare class MediaService {
    private readonly prisma;
    private readonly uploadDir;
    private readonly thumbnailDir;
    private readonly allowedImageTypes;
    private readonly allowedVideoTypes;
    private readonly maxFileSize;
    constructor(prisma: DatabaseService);
    private ensureUploadDirectories;
    uploadMedia(file: Express.Multer.File, type: string, userId: string, altText?: string, title?: string): Promise<{
        uploadedBy: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        fileName: string;
        storedPath: string;
        publicUrl: string;
        mimeType: string;
        type: string;
        size: number;
        width: number | null;
        height: number | null;
        thumbnail: string | null;
        altText: string | null;
        title: string | null;
        uploadedById: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private validateFile;
    getAllMedia(page?: number, limit?: number, type?: string, search?: string): Promise<{
        data: ({
            uploadedBy: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            fileName: string;
            storedPath: string;
            publicUrl: string;
            mimeType: string;
            type: string;
            size: number;
            width: number | null;
            height: number | null;
            thumbnail: string | null;
            altText: string | null;
            title: string | null;
            uploadedById: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMediaById(id: string): Promise<{
        uploadedBy: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        fileName: string;
        storedPath: string;
        publicUrl: string;
        mimeType: string;
        type: string;
        size: number;
        width: number | null;
        height: number | null;
        thumbnail: string | null;
        altText: string | null;
        title: string | null;
        uploadedById: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMedia(id: string, dto: UpdateMediaDto): Promise<{
        uploadedBy: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        fileName: string;
        storedPath: string;
        publicUrl: string;
        mimeType: string;
        type: string;
        size: number;
        width: number | null;
        height: number | null;
        thumbnail: string | null;
        altText: string | null;
        title: string | null;
        uploadedById: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteMedia(id: string): Promise<{
        message: string;
    }>;
}
