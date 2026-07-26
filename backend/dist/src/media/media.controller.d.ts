import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    uploadMedia(file: Express.Multer.File, dto: UploadMediaDto, user: any): Promise<{
        uploadedBy: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        altText: string | null;
        title: string | null;
        fileName: string;
        storedPath: string;
        publicUrl: string;
        mimeType: string;
        type: string;
        size: number;
        width: number | null;
        height: number | null;
        thumbnail: string | null;
        uploadedById: string;
    }>;
    getAllMedia(page?: number, limit?: number, type?: string, search?: string): Promise<{
        data: ({
            uploadedBy: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            altText: string | null;
            title: string | null;
            fileName: string;
            storedPath: string;
            publicUrl: string;
            mimeType: string;
            type: string;
            size: number;
            width: number | null;
            height: number | null;
            thumbnail: string | null;
            uploadedById: string;
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
        createdAt: Date;
        updatedAt: Date;
        altText: string | null;
        title: string | null;
        fileName: string;
        storedPath: string;
        publicUrl: string;
        mimeType: string;
        type: string;
        size: number;
        width: number | null;
        height: number | null;
        thumbnail: string | null;
        uploadedById: string;
    }>;
    updateMedia(id: string, dto: UpdateMediaDto): Promise<{
        uploadedBy: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        altText: string | null;
        title: string | null;
        fileName: string;
        storedPath: string;
        publicUrl: string;
        mimeType: string;
        type: string;
        size: number;
        width: number | null;
        height: number | null;
        thumbnail: string | null;
        uploadedById: string;
    }>;
    deleteMedia(id: string): Promise<{
        message: string;
    }>;
}
