import { DatabaseService } from '../database/database.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-value.dto';
export declare class AttributesService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    createAttribute(dto: CreateAttributeDto): Promise<{
        values: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            value: string;
            referenceValue: string | null;
            mediaId: string | null;
            attributeId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        slug: string;
    }>;
    getAllAttributes(): Promise<{
        valueCount: number;
        productCount: number;
        _count: {
            values: number;
            productAttributes: number;
        };
        values: ({
            media: {
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
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            value: string;
            referenceValue: string | null;
            mediaId: string | null;
            attributeId: string;
        })[];
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        slug: string;
    }[]>;
    getAttributeById(id: string): Promise<{
        valueCount: number;
        productCount: number;
        _count: {
            values: number;
            productAttributes: number;
        };
        values: ({
            media: {
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
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            value: string;
            referenceValue: string | null;
            mediaId: string | null;
            attributeId: string;
        })[];
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        slug: string;
    }>;
    updateAttribute(id: string, dto: UpdateAttributeDto): Promise<{
        values: ({
            media: {
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
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            value: string;
            referenceValue: string | null;
            mediaId: string | null;
            attributeId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        slug: string;
    }>;
    deleteAttribute(id: string): Promise<{
        message: string;
    }>;
    createAttributeValue(attributeId: string, dto: CreateAttributeValueDto): Promise<{
        media: {
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
        attribute: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        value: string;
        referenceValue: string | null;
        mediaId: string | null;
        attributeId: string;
    }>;
    getAttributeValues(attributeId: string): Promise<({
        media: {
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
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        value: string;
        referenceValue: string | null;
        mediaId: string | null;
        attributeId: string;
    })[]>;
    getAttributeValueById(attributeId: string, valueId: string): Promise<{
        media: {
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
        attribute: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        value: string;
        referenceValue: string | null;
        mediaId: string | null;
        attributeId: string;
    }>;
    updateAttributeValue(attributeId: string, valueId: string, dto: Partial<CreateAttributeValueDto>): Promise<{
        media: {
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
        attribute: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        value: string;
        referenceValue: string | null;
        mediaId: string | null;
        attributeId: string;
    }>;
    deleteAttributeValue(attributeId: string, valueId: string): Promise<{
        message: string;
    }>;
}
