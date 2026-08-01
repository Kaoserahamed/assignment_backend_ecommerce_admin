"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProduct(dto) {
        if (dto.price !== undefined && dto.salePrice !== undefined && dto.salePrice !== null) {
            if (dto.salePrice > dto.price) {
                throw new common_1.BadRequestException('Sale price cannot exceed regular price');
            }
        }
        const existingSlug = await this.prisma.product.findUnique({
            where: { slug: dto.slug },
        });
        if (existingSlug) {
            throw new common_1.ConflictException('Product with this slug already exists');
        }
        if (dto.sku) {
            const existingSku = await this.prisma.product.findUnique({
                where: { sku: dto.sku },
            });
            if (existingSku) {
                throw new common_1.ConflictException('Product with this SKU already exists');
            }
        }
        if (dto.brandId) {
            const brand = await this.prisma.brand.findUnique({
                where: { id: dto.brandId },
            });
            if (!brand) {
                throw new common_1.NotFoundException('Brand not found');
            }
        }
        if (dto.categoryIds && dto.categoryIds.length > 0) {
            const categories = await this.prisma.category.findMany({
                where: { id: { in: dto.categoryIds } },
            });
            if (categories.length !== dto.categoryIds.length) {
                throw new common_1.BadRequestException('One or more categories not found');
            }
        }
        if (dto.mediaIds && dto.mediaIds.length > 0) {
            const media = await this.prisma.media.findMany({
                where: { id: { in: dto.mediaIds } },
            });
            if (media.length !== dto.mediaIds.length) {
                throw new common_1.BadRequestException('One or more media files not found');
            }
        }
        if (dto.attributeIds && dto.attributeIds.length > 0) {
            const attributes = await this.prisma.attribute.findMany({
                where: { id: { in: dto.attributeIds } },
            });
            if (attributes.length !== dto.attributeIds.length) {
                throw new common_1.BadRequestException('One or more attributes not found');
            }
        }
        const product = await this.prisma.$transaction(async (tx) => {
            const newProduct = await tx.product.create({
                data: {
                    name: dto.name,
                    slug: dto.slug,
                    sku: dto.sku,
                    shortDescription: dto.shortDescription,
                    longDescription: dto.longDescription,
                    hasVariants: dto.hasVariants ?? false,
                    price: dto.price,
                    salePrice: dto.salePrice,
                    stock: dto.stock,
                    stockStatus: dto.stockStatus,
                    weight: dto.weight,
                    active: dto.active ?? true,
                    featured: dto.featured ?? false,
                    sortOrder: dto.sortOrder ?? 0,
                    brandId: dto.brandId,
                },
            });
            if (dto.categoryIds && dto.categoryIds.length > 0) {
                await tx.productCategory.createMany({
                    data: dto.categoryIds.map((categoryId) => ({
                        productId: newProduct.id,
                        categoryId,
                    })),
                });
            }
            if (dto.mediaIds && dto.mediaIds.length > 0) {
                await tx.productMedia.createMany({
                    data: dto.mediaIds.map((mediaId, index) => ({
                        productId: newProduct.id,
                        mediaId,
                        isThumbnail: index === 0,
                        isGallery: true,
                        sortOrder: index,
                    })),
                });
            }
            if (dto.attributeIds && dto.attributeIds.length > 0) {
                await tx.productAttribute.createMany({
                    data: dto.attributeIds.map((attributeId) => ({
                        productId: newProduct.id,
                        attributeId,
                    })),
                });
            }
            return newProduct;
        });
        return this.getProductById(product.id);
    }
    async getAllProducts(page = 1, limit = 20, search, categoryId, brandId, active, featured) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { shortDescription: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (categoryId) {
            where.categories = {
                some: { categoryId },
            };
        }
        if (brandId) {
            where.brandId = brandId;
        }
        if (active !== undefined) {
            where.active = active;
        }
        if (featured !== undefined) {
            where.featured = featured;
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    brand: true,
                    categories: {
                        include: {
                            category: true,
                        },
                    },
                    media: {
                        include: {
                            media: true,
                        },
                        orderBy: { sortOrder: 'asc' },
                    },
                    variants: true,
                    _count: {
                        select: { variants: true },
                    },
                },
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data: products.map((product) => ({
                ...product,
                variantCount: product._count.variants,
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                brand: true,
                categories: {
                    include: {
                        category: true,
                    },
                },
                media: {
                    include: {
                        media: true,
                    },
                    orderBy: { sortOrder: 'asc' },
                },
                attributes: {
                    include: {
                        attribute: {
                            include: {
                                values: true,
                            },
                        },
                    },
                },
                variants: {
                    include: {
                        attributeValues: {
                            include: {
                                attributeValue: {
                                    include: {
                                        attribute: true,
                                    },
                                },
                            },
                        },
                        media: {
                            include: {
                                media: true,
                            },
                            orderBy: { sortOrder: 'asc' },
                        },
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async updateProduct(id, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const finalPrice = dto.price !== undefined ? dto.price : product.price;
        const finalSalePrice = dto.salePrice !== undefined ? dto.salePrice : product.salePrice;
        if (finalPrice !== undefined && finalPrice !== null && finalSalePrice !== undefined && finalSalePrice !== null) {
            if (finalSalePrice > finalPrice) {
                throw new common_1.BadRequestException('Sale price cannot exceed regular price');
            }
        }
        if (dto.slug && dto.slug !== product.slug) {
            const existing = await this.prisma.product.findUnique({
                where: { slug: dto.slug },
            });
            if (existing) {
                throw new common_1.ConflictException('Product with this slug already exists');
            }
        }
        if (dto.sku && dto.sku !== product.sku) {
            const existing = await this.prisma.product.findUnique({
                where: { sku: dto.sku },
            });
            if (existing) {
                throw new common_1.ConflictException('Product with this SKU already exists');
            }
        }
        if (dto.brandId) {
            const brand = await this.prisma.brand.findUnique({
                where: { id: dto.brandId },
            });
            if (!brand) {
                throw new common_1.NotFoundException('Brand not found');
            }
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            const updatedProduct = await tx.product.update({
                where: { id },
                data: {
                    name: dto.name,
                    slug: dto.slug,
                    sku: dto.sku,
                    shortDescription: dto.shortDescription,
                    longDescription: dto.longDescription,
                    hasVariants: dto.hasVariants,
                    price: dto.price,
                    salePrice: dto.salePrice,
                    stock: dto.stock,
                    stockStatus: dto.stockStatus,
                    weight: dto.weight,
                    active: dto.active,
                    featured: dto.featured,
                    sortOrder: dto.sortOrder,
                    brandId: dto.brandId,
                },
            });
            if (dto.categoryIds !== undefined) {
                if (dto.categoryIds.length > 0) {
                    const categories = await tx.category.findMany({
                        where: { id: { in: dto.categoryIds } },
                    });
                    if (categories.length !== dto.categoryIds.length) {
                        throw new common_1.BadRequestException('One or more categories not found');
                    }
                }
                await tx.productCategory.deleteMany({
                    where: { productId: id },
                });
                if (dto.categoryIds.length > 0) {
                    await tx.productCategory.createMany({
                        data: dto.categoryIds.map((categoryId) => ({
                            productId: id,
                            categoryId,
                        })),
                    });
                }
            }
            if (dto.mediaIds !== undefined) {
                if (dto.mediaIds.length > 0) {
                    const media = await tx.media.findMany({
                        where: { id: { in: dto.mediaIds } },
                    });
                    if (media.length !== dto.mediaIds.length) {
                        throw new common_1.BadRequestException('One or more media files not found');
                    }
                }
                await tx.productMedia.deleteMany({
                    where: { productId: id },
                });
                if (dto.mediaIds.length > 0) {
                    await tx.productMedia.createMany({
                        data: dto.mediaIds.map((mediaId, index) => ({
                            productId: id,
                            mediaId,
                            isThumbnail: index === 0,
                            isGallery: true,
                            sortOrder: index,
                        })),
                    });
                }
            }
            if (dto.attributeIds !== undefined) {
                if (dto.attributeIds.length > 0) {
                    const attributes = await tx.attribute.findMany({
                        where: { id: { in: dto.attributeIds } },
                    });
                    if (attributes.length !== dto.attributeIds.length) {
                        throw new common_1.BadRequestException('One or more attributes not found');
                    }
                }
                await tx.productAttribute.deleteMany({
                    where: { productId: id },
                });
                if (dto.attributeIds.length > 0) {
                    await tx.productAttribute.createMany({
                        data: dto.attributeIds.map((attributeId) => ({
                            productId: id,
                            attributeId,
                        })),
                    });
                }
            }
            return updatedProduct;
        });
        return this.getProductById(updated.id);
    }
    async deleteProduct(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return { message: 'Product deleted successfully' };
    }
    async validateUniqueVariantCombination(productId, attributeValueIds, excludeVariantId) {
        const sortedIds = [...attributeValueIds].sort();
        const existingVariants = await this.prisma.productVariant.findMany({
            where: {
                productId,
                ...(excludeVariantId && { id: { not: excludeVariantId } }),
            },
            include: {
                attributeValues: true,
            },
        });
        for (const variant of existingVariants) {
            const variantAttrIds = variant.attributeValues
                .map((av) => av.attributeValueId)
                .sort();
            if (JSON.stringify(variantAttrIds) === JSON.stringify(sortedIds)) {
                throw new common_1.ConflictException('A variant with this attribute combination already exists for this product');
            }
        }
    }
    async createVariant(productId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!product.hasVariants) {
            throw new common_1.BadRequestException('Product does not support variants');
        }
        if (dto.salePrice !== undefined && dto.salePrice !== null) {
            if (dto.salePrice > dto.price) {
                throw new common_1.BadRequestException('Sale price cannot exceed regular price');
            }
        }
        await this.validateUniqueVariantCombination(productId, dto.attributeValueIds);
        const existingSku = await this.prisma.productVariant.findUnique({
            where: { sku: dto.sku },
        });
        if (existingSku) {
            throw new common_1.ConflictException('Variant with this SKU already exists');
        }
        const attributeValues = await this.prisma.attributeValue.findMany({
            where: { id: { in: dto.attributeValueIds } },
        });
        if (attributeValues.length !== dto.attributeValueIds.length) {
            throw new common_1.BadRequestException('One or more attribute values not found');
        }
        if (dto.mediaIds && dto.mediaIds.length > 0) {
            const media = await this.prisma.media.findMany({
                where: { id: { in: dto.mediaIds } },
            });
            if (media.length !== dto.mediaIds.length) {
                throw new common_1.BadRequestException('One or more media files not found');
            }
        }
        const variant = await this.prisma.$transaction(async (tx) => {
            const newVariant = await tx.productVariant.create({
                data: {
                    productId,
                    sku: dto.sku,
                    price: dto.price,
                    salePrice: dto.salePrice,
                    stock: dto.stock,
                    stockStatus: dto.stockStatus,
                    lowStockThreshold: dto.lowStockThreshold,
                    weight: dto.weight,
                    active: dto.active ?? true,
                },
            });
            await tx.variantAttributeValue.createMany({
                data: dto.attributeValueIds.map((attributeValueId) => ({
                    variantId: newVariant.id,
                    attributeValueId,
                })),
            });
            if (dto.mediaIds && dto.mediaIds.length > 0) {
                await tx.variantMedia.createMany({
                    data: dto.mediaIds.map((mediaId, index) => ({
                        variantId: newVariant.id,
                        mediaId,
                        isThumbnail: index === 0,
                        isGallery: true,
                        sortOrder: index,
                    })),
                });
            }
            return newVariant;
        });
        return this.getVariantById(productId, variant.id);
    }
    async getProductVariants(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const variants = await this.prisma.productVariant.findMany({
            where: { productId },
            include: {
                attributeValues: {
                    include: {
                        attributeValue: {
                            include: {
                                attribute: true,
                            },
                        },
                    },
                },
                media: {
                    include: {
                        media: true,
                    },
                    orderBy: { sortOrder: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return variants;
    }
    async getVariantById(productId, variantId) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
            include: {
                product: true,
                attributeValues: {
                    include: {
                        attributeValue: {
                            include: {
                                attribute: true,
                            },
                        },
                    },
                },
                media: {
                    include: {
                        media: true,
                    },
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
        if (!variant || variant.productId !== productId) {
            throw new common_1.NotFoundException('Variant not found');
        }
        return variant;
    }
    async updateVariant(productId, variantId, dto) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
        });
        if (!variant || variant.productId !== productId) {
            throw new common_1.NotFoundException('Variant not found');
        }
        const finalPrice = dto.price !== undefined ? dto.price : variant.price;
        const finalSalePrice = dto.salePrice !== undefined ? dto.salePrice : variant.salePrice;
        if (finalPrice !== undefined && finalPrice !== null && finalSalePrice !== undefined && finalSalePrice !== null) {
            if (finalSalePrice > finalPrice) {
                throw new common_1.BadRequestException('Sale price cannot exceed regular price');
            }
        }
        if (dto.attributeValueIds && dto.attributeValueIds.length > 0) {
            await this.validateUniqueVariantCombination(productId, dto.attributeValueIds, variantId);
        }
        if (dto.sku && dto.sku !== variant.sku) {
            const existing = await this.prisma.productVariant.findUnique({
                where: { sku: dto.sku },
            });
            if (existing) {
                throw new common_1.ConflictException('Variant with this SKU already exists');
            }
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            const updatedVariant = await tx.productVariant.update({
                where: { id: variantId },
                data: {
                    sku: dto.sku,
                    price: dto.price,
                    salePrice: dto.salePrice,
                    stock: dto.stock,
                    stockStatus: dto.stockStatus,
                    lowStockThreshold: dto.lowStockThreshold,
                    weight: dto.weight,
                    active: dto.active,
                },
            });
            if (dto.attributeValueIds !== undefined) {
                if (dto.attributeValueIds.length > 0) {
                    const attributeValues = await tx.attributeValue.findMany({
                        where: { id: { in: dto.attributeValueIds } },
                    });
                    if (attributeValues.length !== dto.attributeValueIds.length) {
                        throw new common_1.BadRequestException('One or more attribute values not found');
                    }
                }
                await tx.variantAttributeValue.deleteMany({
                    where: { variantId },
                });
                if (dto.attributeValueIds.length > 0) {
                    await tx.variantAttributeValue.createMany({
                        data: dto.attributeValueIds.map((attributeValueId) => ({
                            variantId,
                            attributeValueId,
                        })),
                    });
                }
            }
            if (dto.mediaIds !== undefined) {
                if (dto.mediaIds.length > 0) {
                    const media = await tx.media.findMany({
                        where: { id: { in: dto.mediaIds } },
                    });
                    if (media.length !== dto.mediaIds.length) {
                        throw new common_1.BadRequestException('One or more media files not found');
                    }
                }
                await tx.variantMedia.deleteMany({
                    where: { variantId },
                });
                if (dto.mediaIds.length > 0) {
                    await tx.variantMedia.createMany({
                        data: dto.mediaIds.map((mediaId, index) => ({
                            variantId,
                            mediaId,
                            isThumbnail: index === 0,
                            isGallery: true,
                            sortOrder: index,
                        })),
                    });
                }
            }
            return updatedVariant;
        });
        return this.getVariantById(productId, updated.id);
    }
    async deleteVariant(productId, variantId) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
        });
        if (!variant || variant.productId !== productId) {
            throw new common_1.NotFoundException('Variant not found');
        }
        await this.prisma.productVariant.delete({
            where: { id: variantId },
        });
        return { message: 'Variant deleted successfully' };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ProductsService);
//# sourceMappingURL=products.service.js.map