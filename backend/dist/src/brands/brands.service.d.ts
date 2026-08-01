import { DatabaseService } from '../database/database.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    createBrand(dto: CreateBrandDto): Promise<{
        logo: {
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
        } | null;
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoId: string | null;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllBrands(includeInactive?: boolean): Promise<{
        productCount: number;
        _count: {
            products: number;
        };
        logo: {
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
        } | null;
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoId: string | null;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getBrandById(id: string): Promise<{
        productCount: number;
        _count: {
            products: number;
        };
        logo: {
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
        } | null;
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoId: string | null;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateBrand(id: string, dto: UpdateBrandDto): Promise<{
        logo: {
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
        } | null;
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoId: string | null;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteBrand(id: string): Promise<{
        message: string;
    }>;
}
