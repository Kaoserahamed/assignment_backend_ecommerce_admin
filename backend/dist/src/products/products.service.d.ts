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
            };
        } & {
            id: string;
            productId: string;
            mediaId: string;
            isThumbnail: boolean;
            isGallery: boolean;
            sortOrder: number;
        })[];
        brand: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            logoId: string | null;
            status: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        categories: ({
            category: {
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
            };
        } & {
            productId: string;
            categoryId: string;
        })[];
        variants: ({
            media: ({
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
                };
            } & {
                id: string;
                variantId: string;
                mediaId: string;
                isThumbnail: boolean;
                isGallery: boolean;
                sortOrder: number;
            })[];
            attributeValues: ({
                attributeValue: {
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
                };
            } & {
                variantId: string;
                attributeValueId: string;
            })[];
        } & {
            id: string;
            productId: string;
            sku: string;
            price: number;
            salePrice: number | null;
            stock: number;
            stockStatus: string;
            lowStockThreshold: number | null;
            weight: number | null;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
        attributes: ({
            attribute: {
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
            };
        } & {
            productId: string;
            attributeId: string;
        })[];
    } & {
        id: string;
        name: string;
        slug: string;
        sku: string | null;
        shortDescription: string | null;
        longDescription: string | null;
        hasVariants: boolean;
        price: number | null;
        salePrice: number | null;
        stock: number | null;
        stockStatus: string | null;
        weight: number | null;
        active: boolean;
        featured: boolean;
        sortOrder: number;
        brandId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllProducts(page?: number, limit?: number, search?: string, categoryId?: string, brandId?: string, active?: boolean, featured?: boolean): Promise<{
        data: {
            variantCount: number;
            media: ({
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
                };
            } & {
                id: string;
                productId: string;
                mediaId: string;
                isThumbnail: boolean;
                isGallery: boolean;
                sortOrder: number;
            })[];
            brand: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
                logoId: string | null;
                status: boolean;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            categories: ({
                category: {
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
                };
            } & {
                productId: string;
                categoryId: string;
            })[];
            variants: {
                id: string;
                productId: string;
                sku: string;
                price: number;
                salePrice: number | null;
                stock: number;
                stockStatus: string;
                lowStockThreshold: number | null;
                weight: number | null;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
            }[];
            _count: {
                variants: number;
            };
            id: string;
            name: string;
            slug: string;
            sku: string | null;
            shortDescription: string | null;
            longDescription: string | null;
            hasVariants: boolean;
            price: number | null;
            salePrice: number | null;
            stock: number | null;
            stockStatus: string | null;
            weight: number | null;
            active: boolean;
            featured: boolean;
            sortOrder: number;
            brandId: string | null;
            createdAt: Date;
            updatedAt: Date;
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
            };
        } & {
            id: string;
            productId: string;
            mediaId: string;
            isThumbnail: boolean;
            isGallery: boolean;
            sortOrder: number;
        })[];
        brand: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            logoId: string | null;
            status: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        categories: ({
            category: {
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
            };
        } & {
            productId: string;
            categoryId: string;
        })[];
        variants: ({
            media: ({
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
                };
            } & {
                id: string;
                variantId: string;
                mediaId: string;
                isThumbnail: boolean;
                isGallery: boolean;
                sortOrder: number;
            })[];
            attributeValues: ({
                attributeValue: {
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
                };
            } & {
                variantId: string;
                attributeValueId: string;
            })[];
        } & {
            id: string;
            productId: string;
            sku: string;
            price: number;
            salePrice: number | null;
            stock: number;
            stockStatus: string;
            lowStockThreshold: number | null;
            weight: number | null;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
        attributes: ({
            attribute: {
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
            };
        } & {
            productId: string;
            attributeId: string;
        })[];
    } & {
        id: string;
        name: string;
        slug: string;
        sku: string | null;
        shortDescription: string | null;
        longDescription: string | null;
        hasVariants: boolean;
        price: number | null;
        salePrice: number | null;
        stock: number | null;
        stockStatus: string | null;
        weight: number | null;
        active: boolean;
        featured: boolean;
        sortOrder: number;
        brandId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProduct(id: string, dto: UpdateProductDto): Promise<{
        media: ({
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
            };
        } & {
            id: string;
            productId: string;
            mediaId: string;
            isThumbnail: boolean;
            isGallery: boolean;
            sortOrder: number;
        })[];
        brand: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            logoId: string | null;
            status: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        categories: ({
            category: {
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
            };
        } & {
            productId: string;
            categoryId: string;
        })[];
        variants: ({
            media: ({
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
                };
            } & {
                id: string;
                variantId: string;
                mediaId: string;
                isThumbnail: boolean;
                isGallery: boolean;
                sortOrder: number;
            })[];
            attributeValues: ({
                attributeValue: {
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
                };
            } & {
                variantId: string;
                attributeValueId: string;
            })[];
        } & {
            id: string;
            productId: string;
            sku: string;
            price: number;
            salePrice: number | null;
            stock: number;
            stockStatus: string;
            lowStockThreshold: number | null;
            weight: number | null;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
        attributes: ({
            attribute: {
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
            };
        } & {
            productId: string;
            attributeId: string;
        })[];
    } & {
        id: string;
        name: string;
        slug: string;
        sku: string | null;
        shortDescription: string | null;
        longDescription: string | null;
        hasVariants: boolean;
        price: number | null;
        salePrice: number | null;
        stock: number | null;
        stockStatus: string | null;
        weight: number | null;
        active: boolean;
        featured: boolean;
        sortOrder: number;
        brandId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
    private validateUniqueVariantCombination;
    createVariant(productId: string, dto: CreateVariantDto): Promise<{
        media: ({
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
            };
        } & {
            id: string;
            variantId: string;
            mediaId: string;
            isThumbnail: boolean;
            isGallery: boolean;
            sortOrder: number;
        })[];
        product: {
            id: string;
            name: string;
            slug: string;
            sku: string | null;
            shortDescription: string | null;
            longDescription: string | null;
            hasVariants: boolean;
            price: number | null;
            salePrice: number | null;
            stock: number | null;
            stockStatus: string | null;
            weight: number | null;
            active: boolean;
            featured: boolean;
            sortOrder: number;
            brandId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        attributeValues: ({
            attributeValue: {
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
            };
        } & {
            variantId: string;
            attributeValueId: string;
        })[];
    } & {
        id: string;
        productId: string;
        sku: string;
        price: number;
        salePrice: number | null;
        stock: number;
        stockStatus: string;
        lowStockThreshold: number | null;
        weight: number | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProductVariants(productId: string): Promise<({
        media: ({
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
            };
        } & {
            id: string;
            variantId: string;
            mediaId: string;
            isThumbnail: boolean;
            isGallery: boolean;
            sortOrder: number;
        })[];
        attributeValues: ({
            attributeValue: {
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
            };
        } & {
            variantId: string;
            attributeValueId: string;
        })[];
    } & {
        id: string;
        productId: string;
        sku: string;
        price: number;
        salePrice: number | null;
        stock: number;
        stockStatus: string;
        lowStockThreshold: number | null;
        weight: number | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getVariantById(productId: string, variantId: string): Promise<{
        media: ({
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
            };
        } & {
            id: string;
            variantId: string;
            mediaId: string;
            isThumbnail: boolean;
            isGallery: boolean;
            sortOrder: number;
        })[];
        product: {
            id: string;
            name: string;
            slug: string;
            sku: string | null;
            shortDescription: string | null;
            longDescription: string | null;
            hasVariants: boolean;
            price: number | null;
            salePrice: number | null;
            stock: number | null;
            stockStatus: string | null;
            weight: number | null;
            active: boolean;
            featured: boolean;
            sortOrder: number;
            brandId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        attributeValues: ({
            attributeValue: {
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
            };
        } & {
            variantId: string;
            attributeValueId: string;
        })[];
    } & {
        id: string;
        productId: string;
        sku: string;
        price: number;
        salePrice: number | null;
        stock: number;
        stockStatus: string;
        lowStockThreshold: number | null;
        weight: number | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateVariant(productId: string, variantId: string, dto: Partial<CreateVariantDto>): Promise<{
        media: ({
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
            };
        } & {
            id: string;
            variantId: string;
            mediaId: string;
            isThumbnail: boolean;
            isGallery: boolean;
            sortOrder: number;
        })[];
        product: {
            id: string;
            name: string;
            slug: string;
            sku: string | null;
            shortDescription: string | null;
            longDescription: string | null;
            hasVariants: boolean;
            price: number | null;
            salePrice: number | null;
            stock: number | null;
            stockStatus: string | null;
            weight: number | null;
            active: boolean;
            featured: boolean;
            sortOrder: number;
            brandId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        attributeValues: ({
            attributeValue: {
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
            };
        } & {
            variantId: string;
            attributeValueId: string;
        })[];
    } & {
        id: string;
        productId: string;
        sku: string;
        price: number;
        salePrice: number | null;
        stock: number;
        stockStatus: string;
        lowStockThreshold: number | null;
        weight: number | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteVariant(productId: string, variantId: string): Promise<{
        message: string;
    }>;
}
