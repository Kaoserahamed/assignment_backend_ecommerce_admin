import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: DatabaseService) {}

  async createCategory(dto: CreateCategoryDto) {
    // Check slug uniqueness
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('Category with this slug already exists');
    }

    // Verify parent exists if provided
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    // Verify image exists if provided
    if (dto.imageId) {
      const image = await this.prisma.media.findUnique({
        where: { id: dto.imageId },
      });

      if (!image) {
        throw new NotFoundException('Image not found');
      }
    }

    const category = await this.prisma.category.create({
      data: {
        ...dto,
        active: dto.active ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: {
        image: true,
        parent: true,
        children: true,
      },
    });

    return category;
  }

  async getAllCategories(includeInactive?: boolean) {
    const categories = await this.prisma.category.findMany({
      where: includeInactive ? undefined : { active: true },
      include: {
        image: true,
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    return categories;
  }

  async getCategoryTree() {
    // Get all categories
    const categories = await this.prisma.category.findMany({
      where: { active: true },
      include: {
        image: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    // Build tree structure
    const categoryMap = new Map();
    const tree: any[] = [];

    // First pass: create map of all categories
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build tree
    categories.forEach((category) => {
      const node = categoryMap.get(category.id);
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          tree.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    return tree;
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        image: true,
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check slug uniqueness if slug is being updated
    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });

      if (existing) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    // Verify parent exists and prevent cycles
    if (dto.parentId !== undefined) {
      if (dto.parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      if (dto.parentId) {
        const parent = await this.prisma.category.findUnique({
          where: { id: dto.parentId },
        });

        if (!parent) {
          throw new NotFoundException('Parent category not found');
        }

        // Check for cycles
        const wouldCreateCycle = await this.checkCycle(id, dto.parentId);
        if (wouldCreateCycle) {
          throw new BadRequestException('This would create a circular reference in the category tree');
        }
      }
    }

    // Verify image exists if provided
    if (dto.imageId) {
      const image = await this.prisma.media.findUnique({
        where: { id: dto.imageId },
      });

      if (!image) {
        throw new NotFoundException('Image not found');
      }
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: dto,
      include: {
        image: true,
        parent: true,
        children: true,
      },
    });

    return updated;
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true, children: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.children > 0) {
      throw new BadRequestException('Cannot delete category with child categories');
    }

    if (category._count.products > 0) {
      throw new BadRequestException('Cannot delete category with assigned products');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }

  // Helper method to detect cycles in category tree
  private async checkCycle(categoryId: string, newParentId: string): Promise<boolean> {
    let currentId: string | null = newParentId;

    while (currentId) {
      if (currentId === categoryId) {
        return true; // Cycle detected
      }

      const parent = await this.prisma.category.findUnique({
        where: { id: currentId },
        select: { parentId: true },
      });

      currentId = parent?.parentId || null;
    }

    return false; // No cycle
  }
}
