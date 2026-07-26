import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: DatabaseService) {}

  async createBrand(dto: CreateBrandDto) {
    // Check name uniqueness
    const existingName = await this.prisma.brand.findUnique({
      where: { name: dto.name },
    });

    if (existingName) {
      throw new ConflictException('Brand with this name already exists');
    }

    // Check slug uniqueness
    const existingSlug = await this.prisma.brand.findUnique({
      where: { slug: dto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('Brand with this slug already exists');
    }

    // Verify logo exists if provided
    if (dto.logoId) {
      const logo = await this.prisma.media.findUnique({
        where: { id: dto.logoId },
      });

      if (!logo) {
        throw new NotFoundException('Logo image not found');
      }
    }

    const brand = await this.prisma.brand.create({
      data: {
        ...dto,
        status: dto.status ?? true,
      },
      include: {
        logo: true,
      },
    });

    return brand;
  }

  async getAllBrands(includeInactive?: boolean) {
    const brands = await this.prisma.brand.findMany({
      where: includeInactive ? undefined : { status: true },
      include: {
        logo: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return brands.map((brand) => ({
      ...brand,
      productCount: brand._count.products,
    }));
  }

  async getBrandById(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        logo: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return {
      ...brand,
      productCount: brand._count.products,
    };
  }

  async updateBrand(id: string, dto: UpdateBrandDto) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== brand.name) {
      const existing = await this.prisma.brand.findUnique({
        where: { name: dto.name },
      });

      if (existing) {
        throw new ConflictException('Brand with this name already exists');
      }
    }

    // Check slug uniqueness if slug is being updated
    if (dto.slug && dto.slug !== brand.slug) {
      const existing = await this.prisma.brand.findUnique({
        where: { slug: dto.slug },
      });

      if (existing) {
        throw new ConflictException('Brand with this slug already exists');
      }
    }

    // Verify logo exists if provided
    if (dto.logoId) {
      const logo = await this.prisma.media.findUnique({
        where: { id: dto.logoId },
      });

      if (!logo) {
        throw new NotFoundException('Logo image not found');
      }
    }

    const updated = await this.prisma.brand.update({
      where: { id },
      data: dto,
      include: {
        logo: true,
      },
    });

    return updated;
  }

  async deleteBrand(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    if (brand._count.products > 0) {
      throw new BadRequestException('Cannot delete brand with assigned products');
    }

    await this.prisma.brand.delete({
      where: { id },
    });

    return { message: 'Brand deleted successfully' };
  }
}
