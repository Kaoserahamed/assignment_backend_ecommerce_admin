import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: DatabaseService) {}

  async createProduct(dto: CreateProductDto) {
    // Check slug uniqueness
    const existingSlug = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('Product with this slug already exists');
    }

    // Check SKU uniqueness if provided
    if (dto.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: dto.sku },
      });

      if (existingSku) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    // Verify brand exists if provided
    if (dto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: dto.brandId },
      });

      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
    }

    // Verify categories exist
    if (dto.categoryIds && dto.categoryIds.length > 0) {
      const categories = await this.prisma.category.findMany({
        where: { id: { in: dto.categoryIds } },
      });

      if (categories.length !== dto.categoryIds.length) {
        throw new BadRequestException('One or more categories not found');
      }
    }

    // Verify media exists
    if (dto.mediaIds && dto.mediaIds.length > 0) {
      const media = await this.prisma.media.findMany({
        where: { id: { in: dto.mediaIds } },
      });

      if (media.length !== dto.mediaIds.length) {
        throw new BadRequestException('One or more media files not found');
      }
    }

    // Verify attributes exist
    if (dto.attributeIds && dto.attributeIds.length > 0) {
      const attributes = await this.prisma.attribute.findMany({
        where: { id: { in: dto.attributeIds } },
      });

      if (attributes.length !== dto.attributeIds.length) {
        throw new BadRequestException('One or more attributes not found');
      }
    }

    // Use transaction to create product with relationships
    const product = await this.prisma.$transaction(async (tx) => {
      // Create product
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

      // Create category relationships
      if (dto.categoryIds && dto.categoryIds.length > 0) {
        await tx.productCategory.createMany({
          data: dto.categoryIds.map((categoryId) => ({
            productId: newProduct.id,
            categoryId,
          })),
        });
      }

      // Create media relationships
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

      // Create attribute relationships
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

  async getAllProducts(
    page = 1,
    limit = 20,
    search?: string,
    categoryId?: string,
    brandId?: string,
    active?: boolean,
    featured?: boolean,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

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

  async getProductById(id: string) {
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
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check slug uniqueness if slug is being updated
    if (dto.slug && dto.slug !== product.slug) {
      const existing = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      });

      if (existing) {
        throw new ConflictException('Product with this slug already exists');
      }
    }

    // Check SKU uniqueness if SKU is being updated
    if (dto.sku && dto.sku !== product.sku) {
      const existing = await this.prisma.product.findUnique({
        where: { sku: dto.sku },
      });

      if (existing) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    // Verify brand exists if provided
    if (dto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: dto.brandId },
      });

      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
    }

    // Use transaction to update product with relationships
    const updated = await this.prisma.$transaction(async (tx) => {
      // Update product
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

      // Update categories if provided
      if (dto.categoryIds !== undefined) {
        if (dto.categoryIds.length > 0) {
          const categories = await tx.category.findMany({
            where: { id: { in: dto.categoryIds } },
          });

          if (categories.length !== dto.categoryIds.length) {
            throw new BadRequestException('One or more categories not found');
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

      // Update media if provided
      if (dto.mediaIds !== undefined) {
        if (dto.mediaIds.length > 0) {
          const media = await tx.media.findMany({
            where: { id: { in: dto.mediaIds } },
          });

          if (media.length !== dto.mediaIds.length) {
            throw new BadRequestException('One or more media files not found');
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

      // Update attributes if provided
      if (dto.attributeIds !== undefined) {
        if (dto.attributeIds.length > 0) {
          const attributes = await tx.attribute.findMany({
            where: { id: { in: dto.attributeIds } },
          });

          if (attributes.length !== dto.attributeIds.length) {
            throw new BadRequestException('One or more attributes not found');
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

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Delete product (cascading deletes will handle relationships)
    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  // Product Variants

  async createVariant(productId: string, dto: CreateVariantDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.hasVariants) {
      throw new BadRequestException('Product does not support variants');
    }

    // Check SKU uniqueness
    const existingSku = await this.prisma.productVariant.findUnique({
      where: { sku: dto.sku },
    });

    if (existingSku) {
      throw new ConflictException('Variant with this SKU already exists');
    }

    // Verify attribute values exist
    const attributeValues = await this.prisma.attributeValue.findMany({
      where: { id: { in: dto.attributeValueIds } },
    });

    if (attributeValues.length !== dto.attributeValueIds.length) {
      throw new BadRequestException('One or more attribute values not found');
    }

    // Verify media exists if provided
    if (dto.mediaIds && dto.mediaIds.length > 0) {
      const media = await this.prisma.media.findMany({
        where: { id: { in: dto.mediaIds } },
      });

      if (media.length !== dto.mediaIds.length) {
        throw new BadRequestException('One or more media files not found');
      }
    }

    // Use transaction to create variant with relationships
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

      // Create attribute value relationships
      await tx.variantAttributeValue.createMany({
        data: dto.attributeValueIds.map((attributeValueId) => ({
          variantId: newVariant.id,
          attributeValueId,
        })),
      });

      // Create media relationships
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

  async getProductVariants(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
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

  async getVariantById(productId: string, variantId: string) {
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
      throw new NotFoundException('Variant not found');
    }

    return variant;
  }

  async updateVariant(productId: string, variantId: string, dto: Partial<CreateVariantDto>) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant || variant.productId !== productId) {
      throw new NotFoundException('Variant not found');
    }

    // Check SKU uniqueness if SKU is being updated
    if (dto.sku && dto.sku !== variant.sku) {
      const existing = await this.prisma.productVariant.findUnique({
        where: { sku: dto.sku },
      });

      if (existing) {
        throw new ConflictException('Variant with this SKU already exists');
      }
    }

    // Use transaction to update variant with relationships
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

      // Update attribute values if provided
      if (dto.attributeValueIds !== undefined) {
        if (dto.attributeValueIds.length > 0) {
          const attributeValues = await tx.attributeValue.findMany({
            where: { id: { in: dto.attributeValueIds } },
          });

          if (attributeValues.length !== dto.attributeValueIds.length) {
            throw new BadRequestException('One or more attribute values not found');
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

      // Update media if provided
      if (dto.mediaIds !== undefined) {
        if (dto.mediaIds.length > 0) {
          const media = await tx.media.findMany({
            where: { id: { in: dto.mediaIds } },
          });

          if (media.length !== dto.mediaIds.length) {
            throw new BadRequestException('One or more media files not found');
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

  async deleteVariant(productId: string, variantId: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant || variant.productId !== productId) {
      throw new NotFoundException('Variant not found');
    }

    await this.prisma.productVariant.delete({
      where: { id: variantId },
    });

    return { message: 'Variant deleted successfully' };
  }
}
