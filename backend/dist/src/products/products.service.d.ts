import { DatabaseService } from '../database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    createProduct(dto: CreateProductDto): Promise<{
        media: ({
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
            };
        } & {
            id: string;
            sortOrder: number;
            mediaId: string;
            productId: string;
            isThumbnail: boolean;
            isGallery: boolean;
        })[];
        brand: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
            slug: string;
            logoId: string | null;
        } | null;
        categories: ({
            category: {
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
            };
        } & {
            productId: string;
            categoryId: string;
        })[];
        attributes: ({
            attribute: {
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
            };
        } & {
            attributeId: string;
            productId: string;
        })[];
        variants: ({
            media: ({
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
                };
            } & {
                id: string;
                sortOrder: number;
                mediaId: string;
                isThumbnail: boolean;
                isGallery: boolean;
                variantId: string;
            })[];
            attributeValues: ({
                attributeValue: {
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
                };
            } & {
                variantId: string;
                attributeValueId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            sku: string;
            price: number;
            salePrice: number | null;
            stock: number;
            stockStatus: string;
            weight: number | null;
            lowStockThreshold: number | null;
            productId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        slug: string;
        sortOrder: number;
        sku: string | null;
        shortDescription: string | null;
        longDescription: string | null;
        hasVariants: boolean;
        price: number | null;
        salePrice: number | null;
        stock: number | null;
        stockStatus: string | null;
        weight: number | null;
        featured: boolean;
        brandId: string | null;
    }>;
    getAllProducts(page?: number, limit?: number, search?: string, categoryId?: string, brandId?: string, active?: boolean, featured?: boolean): Promise<{
        data: {
            variantCount: number;
            media: ({
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
                };
            } & {
                id: string;
                sortOrder: number;
                mediaId: string;
                productId: string;
                isThumbnail: boolean;
                isGallery: boolean;
            })[];
            brand: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                status: boolean;
                slug: string;
                logoId: string | null;
            } | null;
            _count: {
                variants: number;
            };
            categories: ({
                category: {
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
                };
            } & {
                productId: string;
                categoryId: string;
            })[];
            variants: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                active: boolean;
                sku: string;
                price: number;
                salePrice: number | null;
                stock: number;
                stockStatus: string;
                weight: number | null;
                lowStockThreshold: number | null;
                productId: string;
            }[];
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            slug: string;
            sortOrder: number;
            sku: string | null;
            shortDescription: string | null;
            longDescription: string | null;
            hasVariants: boolean;
            price: number | null;
            salePrice: number | null;
            stock: number | null;
            stockStatus: string | null;
            weight: number | null;
            featured: boolean;
            brandId: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getProductById(id: string): Promise<{
        media: ({
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
            };
        } & {
            id: string;
            sortOrder: number;
            mediaId: string;
            productId: string;
            isThumbnail: boolean;
            isGallery: boolean;
        })[];
        brand: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
            slug: string;
            logoId: string | null;
        } | null;
        categories: ({
            category: {
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
            };
        } & {
            productId: string;
            categoryId: string;
        })[];
        attributes: ({
            attribute: {
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
            };
        } & {
            attributeId: string;
            productId: string;
        })[];
        variants: ({
            media: ({
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
                };
            } & {
                id: string;
                sortOrder: number;
                mediaId: string;
                isThumbnail: boolean;
                isGallery: boolean;
                variantId: string;
            })[];
            attributeValues: ({
                attributeValue: {
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
                };
            } & {
                variantId: string;
                attributeValueId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            sku: string;
            price: number;
            salePrice: number | null;
            stock: number;
            stockStatus: string;
            weight: number | null;
            lowStockThreshold: number | null;
            productId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        slug: string;
        sortOrder: number;
        sku: string | null;
        shortDescription: string | null;
        longDescription: string | null;
        hasVariants: boolean;
        price: number | null;
        salePrice: number | null;
        stock: number | null;
        stockStatus: string | null;
        weight: number | null;
        featured: boolean;
        brandId: string | null;
    }>;
    updateProduct(id: string, dto: UpdateProductDto): Promise<{
        media: ({
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
            };
        } & {
            id: string;
            sortOrder: number;
            mediaId: string;
            productId: string;
            isThumbnail: boolean;
            isGallery: boolean;
        })[];
        brand: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
            slug: string;
            logoId: string | null;
        } | null;
        categories: ({
            category: {
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
            };
        } & {
            productId: string;
            categoryId: string;
        })[];
        attributes: ({
            attribute: {
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
            };
        } & {
            attributeId: string;
            productId: string;
        })[];
        variants: ({
            media: ({
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
                };
            } & {
                id: string;
                sortOrder: number;
                mediaId: string;
                isThumbnail: boolean;
                isGallery: boolean;
                variantId: string;
            })[];
            attributeValues: ({
                attributeValue: {
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
                };
            } & {
                variantId: string;
                attributeValueId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            sku: string;
            price: number;
            salePrice: number | null;
            stock: number;
            stockStatus: string;
            weight: number | null;
            lowStockThreshold: number | null;
            productId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        slug: string;
        sortOrder: number;
        sku: string | null;
        shortDescription: string | null;
        longDescription: string | null;
        hasVariants: boolean;
        price: number | null;
        salePrice: number | null;
        stock: number | null;
        stockStatus: string | null;
        weight: number | null;
        featured: boolean;
        brandId: string | null;
    }>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
    createVariant(productId: string, dto: CreateVariantDto): Promise<{
        media: ({
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
            };
        } & {
            id: string;
            sortOrder: number;
            mediaId: string;
            isThumbnail: boolean;
            isGallery: boolean;
            variantId: string;
        })[];
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            slug: string;
            sortOrder: number;
            sku: string | null;
            shortDescription: string | null;
            longDescription: string | null;
            hasVariants: boolean;
            price: number | null;
            salePrice: number | null;
            stock: number | null;
            stockStatus: string | null;
            weight: number | null;
            featured: boolean;
            brandId: string | null;
        };
        attributeValues: ({
            attributeValue: {
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
            };
        } & {
            variantId: string;
            attributeValueId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        sku: string;
        price: number;
        salePrice: number | null;
        stock: number;
        stockStatus: string;
        weight: number | null;
        lowStockThreshold: number | null;
        productId: string;
    }>;
    getProductVariants(productId: string): Promise<({
        media: ({
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
            };
        } & {
            id: string;
            sortOrder: number;
            mediaId: string;
            isThumbnail: boolean;
            isGallery: boolean;
            variantId: string;
        })[];
        attributeValues: ({
            attributeValue: {
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
            };
        } & {
            variantId: string;
            attributeValueId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        sku: string;
        price: number;
        salePrice: number | null;
        stock: number;
        stockStatus: string;
        weight: number | null;
        lowStockThreshold: number | null;
        productId: string;
    })[]>;
    getVariantById(productId: string, variantId: string): Promise<{
        media: ({
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
            };
        } & {
            id: string;
            sortOrder: number;
            mediaId: string;
            isThumbnail: boolean;
            isGallery: boolean;
            variantId: string;
        })[];
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            slug: string;
            sortOrder: number;
            sku: string | null;
            shortDescription: string | null;
            longDescription: string | null;
            hasVariants: boolean;
            price: number | null;
            salePrice: number | null;
            stock: number | null;
            stockStatus: string | null;
            weight: number | null;
            featured: boolean;
            brandId: string | null;
        };
        attributeValues: ({
            attributeValue: {
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
            };
        } & {
            variantId: string;
            attributeValueId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        sku: string;
        price: number;
        salePrice: number | null;
        stock: number;
        stockStatus: string;
        weight: number | null;
        lowStockThreshold: number | null;
        productId: string;
    }>;
    updateVariant(productId: string, variantId: string, dto: Partial<CreateVariantDto>): Promise<{
        media: ({
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
            };
        } & {
            id: string;
            sortOrder: number;
            mediaId: string;
            isThumbnail: boolean;
            isGallery: boolean;
            variantId: string;
        })[];
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            active: boolean;
            slug: string;
            sortOrder: number;
            sku: string | null;
            shortDescription: string | null;
            longDescription: string | null;
            hasVariants: boolean;
            price: number | null;
            salePrice: number | null;
            stock: number | null;
            stockStatus: string | null;
            weight: number | null;
            featured: boolean;
            brandId: string | null;
        };
        attributeValues: ({
            attributeValue: {
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
            };
        } & {
            variantId: string;
            attributeValueId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        sku: string;
        price: number;
        salePrice: number | null;
        stock: number;
        stockStatus: string;
        weight: number | null;
        lowStockThreshold: number | null;
        productId: string;
    }>;
    deleteVariant(productId: string, variantId: string): Promise<{
        message: string;
    }>;
}
