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
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let BrandsService = class BrandsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBrand(dto) {
        const existingName = await this.prisma.brand.findUnique({
            where: { name: dto.name },
        });
        if (existingName) {
            throw new common_1.ConflictException('Brand with this name already exists');
        }
        const existingSlug = await this.prisma.brand.findUnique({
            where: { slug: dto.slug },
        });
        if (existingSlug) {
            throw new common_1.ConflictException('Brand with this slug already exists');
        }
        if (dto.logoId) {
            const logo = await this.prisma.media.findUnique({
                where: { id: dto.logoId },
            });
            if (!logo) {
                throw new common_1.NotFoundException('Logo image not found');
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
    async getAllBrands(includeInactive) {
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
    async getBrandById(id) {
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
            throw new common_1.NotFoundException('Brand not found');
        }
        return {
            ...brand,
            productCount: brand._count.products,
        };
    }
    async updateBrand(id, dto) {
        const brand = await this.prisma.brand.findUnique({
            where: { id },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Brand not found');
        }
        if (dto.name && dto.name !== brand.name) {
            const existing = await this.prisma.brand.findUnique({
                where: { name: dto.name },
            });
            if (existing) {
                throw new common_1.ConflictException('Brand with this name already exists');
            }
        }
        if (dto.slug && dto.slug !== brand.slug) {
            const existing = await this.prisma.brand.findUnique({
                where: { slug: dto.slug },
            });
            if (existing) {
                throw new common_1.ConflictException('Brand with this slug already exists');
            }
        }
        if (dto.logoId) {
            const logo = await this.prisma.media.findUnique({
                where: { id: dto.logoId },
            });
            if (!logo) {
                throw new common_1.NotFoundException('Logo image not found');
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
    async deleteBrand(id) {
        const brand = await this.prisma.brand.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Brand not found');
        }
        if (brand._count.products > 0) {
            throw new common_1.BadRequestException('Cannot delete brand with assigned products');
        }
        await this.prisma.brand.delete({
            where: { id },
        });
        return { message: 'Brand deleted successfully' };
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], BrandsService);
//# sourceMappingURL=brands.service.js.map