import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-value.dto';
export declare class AttributesController {
    private readonly attributesService;
    constructor(attributesService: AttributesService);
    createAttribute(dto: CreateAttributeDto): Promise<{
        values: {
            id: string;
            value: string;
            slug: string;
            referenceValue: string | null;
            attributeId: string;
            mediaId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
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
            value: string;
            slug: string;
            referenceValue: string | null;
            attributeId: string;
            mediaId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        id: string;
        name: string;
        slug: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
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
            value: string;
            slug: string;
            referenceValue: string | null;
            attributeId: string;
            mediaId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        id: string;
        name: string;
        slug: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAttribute(id: string, dto: UpdateAttributeDto): Promise<{
        values: ({
            media: {
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
            value: string;
            slug: string;
            referenceValue: string | null;
            attributeId: string;
            mediaId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        slug: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteAttribute(id: string): Promise<{
        message: string;
    }>;
    createAttributeValue(attributeId: string, dto: CreateAttributeValueDto): Promise<{
        media: {
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
        attribute: {
            id: string;
            name: string;
            slug: string;
            type: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        value: string;
        slug: string;
        referenceValue: string | null;
        attributeId: string;
        mediaId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAttributeValues(attributeId: string): Promise<({
        media: {
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
        value: string;
        slug: string;
        referenceValue: string | null;
        attributeId: string;
        mediaId: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getAttributeValueById(attributeId: string, valueId: string): Promise<{
        media: {
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
        attribute: {
            id: string;
            name: string;
            slug: string;
            type: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        value: string;
        slug: string;
        referenceValue: string | null;
        attributeId: string;
        mediaId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAttributeValue(attributeId: string, valueId: string, dto: Partial<CreateAttributeValueDto>): Promise<{
        media: {
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
        attribute: {
            id: string;
            name: string;
            slug: string;
            type: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        value: string;
        slug: string;
        referenceValue: string | null;
        attributeId: string;
        mediaId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteAttributeValue(attributeId: string, valueId: string): Promise<{
        message: string;
    }>;
}
