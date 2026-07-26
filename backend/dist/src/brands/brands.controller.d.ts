import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    createBrand(dto: CreateBrandDto): Promise<{
        logo: {
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
        } | null;
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        slug: string;
        logoId: string | null;
    }>;
    getAllBrands(includeInactive?: string): Promise<{
        productCount: number;
        _count: {
            products: number;
        };
        logo: {
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
        } | null;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        slug: string;
        logoId: string | null;
    }[]>;
    getBrandById(id: string): Promise<{
        productCount: number;
        _count: {
            products: number;
        };
        logo: {
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
        } | null;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        slug: string;
        logoId: string | null;
    }>;
    updateBrand(id: string, dto: UpdateBrandDto): Promise<{
        logo: {
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
        } | null;
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        slug: string;
        logoId: string | null;
    }>;
    deleteBrand(id: string): Promise<{
        message: string;
    }>;
}
