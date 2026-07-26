import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-value.dto';

@Injectable()
export class AttributesService {
  constructor(private readonly prisma: DatabaseService) {}

  // Attributes CRUD

  async createAttribute(dto: CreateAttributeDto) {
    // Check name uniqueness
    const existingName = await this.prisma.attribute.findUnique({
      where: { name: dto.name },
    });

    if (existingName) {
      throw new ConflictException('Attribute with this name already exists');
    }

    // Check slug uniqueness
    const existingSlug = await this.prisma.attribute.findUnique({
      where: { slug: dto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('Attribute with this slug already exists');
    }

    const attribute = await this.prisma.attribute.create({
      data: dto,
      include: {
        values: true,
      },
    });

    return attribute;
  }

  async getAllAttributes() {
    const attributes = await this.prisma.attribute.findMany({
      include: {
        values: {
          include: {
            media: true,
          },
        },
        _count: {
          select: { values: true, productAttributes: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return attributes.map((attr) => ({
      ...attr,
      valueCount: attr._count.values,
      productCount: attr._count.productAttributes,
    }));
  }

  async getAttributeById(id: string) {
    const attribute = await this.prisma.attribute.findUnique({
      where: { id },
      include: {
        values: {
          include: {
            media: true,
          },
        },
        _count: {
          select: { values: true, productAttributes: true },
        },
      },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    return {
      ...attribute,
      valueCount: attribute._count.values,
      productCount: attribute._count.productAttributes,
    };
  }

  async updateAttribute(id: string, dto: UpdateAttributeDto) {
    const attribute = await this.prisma.attribute.findUnique({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== attribute.name) {
      const existing = await this.prisma.attribute.findUnique({
        where: { name: dto.name },
      });

      if (existing) {
        throw new ConflictException('Attribute with this name already exists');
      }
    }

    // Check slug uniqueness if slug is being updated
    if (dto.slug && dto.slug !== attribute.slug) {
      const existing = await this.prisma.attribute.findUnique({
        where: { slug: dto.slug },
      });

      if (existing) {
        throw new ConflictException('Attribute with this slug already exists');
      }
    }

    const updated = await this.prisma.attribute.update({
      where: { id },
      data: dto,
      include: {
        values: {
          include: {
            media: true,
          },
        },
      },
    });

    return updated;
  }

  async deleteAttribute(id: string) {
    const attribute = await this.prisma.attribute.findUnique({
      where: { id },
      include: {
        _count: {
          select: { values: true, productAttributes: true },
        },
      },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    if (attribute._count.productAttributes > 0) {
      throw new BadRequestException('Cannot delete attribute assigned to products');
    }

    if (attribute._count.values > 0) {
      throw new BadRequestException('Cannot delete attribute with existing values');
    }

    await this.prisma.attribute.delete({
      where: { id },
    });

    return { message: 'Attribute deleted successfully' };
  }

  // Attribute Values CRUD

  async createAttributeValue(attributeId: string, dto: CreateAttributeValueDto) {
    const attribute = await this.prisma.attribute.findUnique({
      where: { id: attributeId },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    // Check slug uniqueness within attribute
    const existing = await this.prisma.attributeValue.findUnique({
      where: {
        attributeId_slug: {
          attributeId,
          slug: dto.slug,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Value with this slug already exists for this attribute');
    }

    // Verify media exists if provided
    if (dto.mediaId) {
      const media = await this.prisma.media.findUnique({
        where: { id: dto.mediaId },
      });

      if (!media) {
        throw new NotFoundException('Media not found');
      }
    }

    const value = await this.prisma.attributeValue.create({
      data: {
        ...dto,
        attributeId,
      },
      include: {
        attribute: true,
        media: true,
      },
    });

    return value;
  }

  async getAttributeValues(attributeId: string) {
    const attribute = await this.prisma.attribute.findUnique({
      where: { id: attributeId },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    const values = await this.prisma.attributeValue.findMany({
      where: { attributeId },
      include: {
        media: true,
      },
      orderBy: { value: 'asc' },
    });

    return values;
  }

  async getAttributeValueById(attributeId: string, valueId: string) {
    const value = await this.prisma.attributeValue.findUnique({
      where: { id: valueId },
      include: {
        attribute: true,
        media: true,
      },
    });

    if (!value || value.attributeId !== attributeId) {
      throw new NotFoundException('Attribute value not found');
    }

    return value;
  }

  async updateAttributeValue(attributeId: string, valueId: string, dto: Partial<CreateAttributeValueDto>) {
    const value = await this.prisma.attributeValue.findUnique({
      where: { id: valueId },
    });

    if (!value || value.attributeId !== attributeId) {
      throw new NotFoundException('Attribute value not found');
    }

    // Check slug uniqueness if slug is being updated
    if (dto.slug && dto.slug !== value.slug) {
      const existing = await this.prisma.attributeValue.findUnique({
        where: {
          attributeId_slug: {
            attributeId,
            slug: dto.slug,
          },
        },
      });

      if (existing) {
        throw new ConflictException('Value with this slug already exists for this attribute');
      }
    }

    // Verify media exists if provided
    if (dto.mediaId) {
      const media = await this.prisma.media.findUnique({
        where: { id: dto.mediaId },
      });

      if (!media) {
        throw new NotFoundException('Media not found');
      }
    }

    const updated = await this.prisma.attributeValue.update({
      where: { id: valueId },
      data: dto,
      include: {
        attribute: true,
        media: true,
      },
    });

    return updated;
  }

  async deleteAttributeValue(attributeId: string, valueId: string) {
    const value = await this.prisma.attributeValue.findUnique({
      where: { id: valueId },
      include: {
        _count: {
          select: { variantValues: true },
        },
      },
    });

    if (!value || value.attributeId !== attributeId) {
      throw new NotFoundException('Attribute value not found');
    }

    if (value._count.variantValues > 0) {
      throw new BadRequestException('Cannot delete attribute value assigned to product variants');
    }

    await this.prisma.attributeValue.delete({
      where: { id: valueId },
    });

    return { message: 'Attribute value deleted successfully' };
  }
}
