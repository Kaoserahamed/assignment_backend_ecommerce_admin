import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    createCategory(dto: CreateCategoryDto): Promise<{
        image: {
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
        parent: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            imageId: string | null;
            parentId: string | null;
            active: boolean;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        children: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            imageId: string | null;
            parentId: string | null;
            active: boolean;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        imageId: string | null;
        parentId: string | null;
        active: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllCategories(includeInactive?: string): Promise<({
        _count: {
            products: number;
        };
        image: {
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
        parent: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            imageId: string | null;
            parentId: string | null;
            active: boolean;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        children: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            imageId: string | null;
            parentId: string | null;
            active: boolean;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        imageId: string | null;
        parentId: string | null;
        active: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getCategoryTree(): Promise<any[]>;
    getCategoryById(id: string): Promise<{
        _count: {
            products: number;
        };
        image: {
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
        parent: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            imageId: string | null;
            parentId: string | null;
            active: boolean;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        children: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            imageId: string | null;
            parentId: string | null;
            active: boolean;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        imageId: string | null;
        parentId: string | null;
        active: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateCategory(id: string, dto: UpdateCategoryDto): Promise<{
        image: {
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
        parent: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            imageId: string | null;
            parentId: string | null;
            active: boolean;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        children: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            imageId: string | null;
            parentId: string | null;
            active: boolean;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        imageId: string | null;
        parentId: string | null;
        active: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteCategory(id: string): Promise<{
        message: string;
    }>;
}
