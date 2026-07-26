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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCategory(dto) {
        const existing = await this.prisma.category.findUnique({
            where: { slug: dto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException('Category with this slug already exists');
        }
        if (dto.parentId) {
            const parent = await this.prisma.category.findUnique({
                where: { id: dto.parentId },
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent category not found');
            }
        }
        if (dto.imageId) {
            const image = await this.prisma.media.findUnique({
                where: { id: dto.imageId },
            });
            if (!image) {
                throw new common_1.NotFoundException('Image not found');
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
    async getAllCategories(includeInactive) {
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
        const categoryMap = new Map();
        const tree = [];
        categories.forEach((category) => {
            categoryMap.set(category.id, { ...category, children: [] });
        });
        categories.forEach((category) => {
            const node = categoryMap.get(category.id);
            if (category.parentId) {
                const parent = categoryMap.get(category.parentId);
                if (parent) {
                    parent.children.push(node);
                }
                else {
                    tree.push(node);
                }
            }
            else {
                tree.push(node);
            }
        });
        return tree;
    }
    async getCategoryById(id) {
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
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async updateCategory(id, dto) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (dto.slug && dto.slug !== category.slug) {
            const existing = await this.prisma.category.findUnique({
                where: { slug: dto.slug },
            });
            if (existing) {
                throw new common_1.ConflictException('Category with this slug already exists');
            }
        }
        if (dto.parentId !== undefined) {
            if (dto.parentId === id) {
                throw new common_1.BadRequestException('Category cannot be its own parent');
            }
            if (dto.parentId) {
                const parent = await this.prisma.category.findUnique({
                    where: { id: dto.parentId },
                });
                if (!parent) {
                    throw new common_1.NotFoundException('Parent category not found');
                }
                const wouldCreateCycle = await this.checkCycle(id, dto.parentId);
                if (wouldCreateCycle) {
                    throw new common_1.BadRequestException('This would create a circular reference in the category tree');
                }
            }
        }
        if (dto.imageId) {
            const image = await this.prisma.media.findUnique({
                where: { id: dto.imageId },
            });
            if (!image) {
                throw new common_1.NotFoundException('Image not found');
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
    async deleteCategory(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true, children: true },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category._count.children > 0) {
            throw new common_1.BadRequestException('Cannot delete category with child categories');
        }
        if (category._count.products > 0) {
            throw new common_1.BadRequestException('Cannot delete category with assigned products');
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return { message: 'Category deleted successfully' };
    }
    async checkCycle(categoryId, newParentId) {
        let currentId = newParentId;
        while (currentId) {
            if (currentId === categoryId) {
                return true;
            }
            const parent = await this.prisma.category.findUnique({
                where: { id: currentId },
                select: { parentId: true },
            });
            currentId = parent?.parentId || null;
        }
        return false;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map