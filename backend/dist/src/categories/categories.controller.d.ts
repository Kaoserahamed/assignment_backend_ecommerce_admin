import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    createCategory(dto: CreateCategoryDto): Promise<{
        image: {
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
        parent: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            slug: string;
            imageId: string | null;
            parentId: string | null;
            sortOrder: number;
        } | null;
        children: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            slug: string;
            imageId: string | null;
            parentId: string | null;
            sortOrder: number;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        slug: string;
        imageId: string | null;
        parentId: string | null;
        sortOrder: number;
    }>;
    getAllCategories(includeInactive?: string): Promise<({
        _count: {
            products: number;
        };
        image: {
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
        parent: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            slug: string;
            imageId: string | null;
            parentId: string | null;
            sortOrder: number;
        } | null;
        children: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            slug: string;
            imageId: string | null;
            parentId: string | null;
            sortOrder: number;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        slug: string;
        imageId: string | null;
        parentId: string | null;
        sortOrder: number;
    })[]>;
    getCategoryTree(): Promise<any[]>;
    getCategoryById(id: string): Promise<{
        _count: {
            products: number;
        };
        image: {
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
        parent: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            slug: string;
            imageId: string | null;
            parentId: string | null;
            sortOrder: number;
        } | null;
        children: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            slug: string;
            imageId: string | null;
            parentId: string | null;
            sortOrder: number;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        slug: string;
        imageId: string | null;
        parentId: string | null;
        sortOrder: number;
    }>;
    updateCategory(id: string, dto: UpdateCategoryDto): Promise<{
        image: {
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
        parent: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            slug: string;
            imageId: string | null;
            parentId: string | null;
            sortOrder: number;
        } | null;
        children: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            slug: string;
            imageId: string | null;
            parentId: string | null;
            sortOrder: number;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        slug: string;
        imageId: string | null;
        parentId: string | null;
        sortOrder: number;
    }>;
    deleteCategory(id: string): Promise<{
        message: string;
    }>;
}
