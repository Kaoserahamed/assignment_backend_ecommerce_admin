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
exports.AttributesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let AttributesService = class AttributesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAttribute(dto) {
        const existingName = await this.prisma.attribute.findUnique({
            where: { name: dto.name },
        });
        if (existingName) {
            throw new common_1.ConflictException('Attribute with this name already exists');
        }
        const existingSlug = await this.prisma.attribute.findUnique({
            where: { slug: dto.slug },
        });
        if (existingSlug) {
            throw new common_1.ConflictException('Attribute with this slug already exists');
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
    async getAttributeById(id) {
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
            throw new common_1.NotFoundException('Attribute not found');
        }
        return {
            ...attribute,
            valueCount: attribute._count.values,
            productCount: attribute._count.productAttributes,
        };
    }
    async updateAttribute(id, dto) {
        const attribute = await this.prisma.attribute.findUnique({
            where: { id },
        });
        if (!attribute) {
            throw new common_1.NotFoundException('Attribute not found');
        }
        if (dto.name && dto.name !== attribute.name) {
            const existing = await this.prisma.attribute.findUnique({
                where: { name: dto.name },
            });
            if (existing) {
                throw new common_1.ConflictException('Attribute with this name already exists');
            }
        }
        if (dto.slug && dto.slug !== attribute.slug) {
            const existing = await this.prisma.attribute.findUnique({
                where: { slug: dto.slug },
            });
            if (existing) {
                throw new common_1.ConflictException('Attribute with this slug already exists');
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
    async deleteAttribute(id) {
        const attribute = await this.prisma.attribute.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { values: true, productAttributes: true },
                },
            },
        });
        if (!attribute) {
            throw new common_1.NotFoundException('Attribute not found');
        }
        if (attribute._count.productAttributes > 0) {
            throw new common_1.BadRequestException('Cannot delete attribute assigned to products');
        }
        if (attribute._count.values > 0) {
            throw new common_1.BadRequestException('Cannot delete attribute with existing values');
        }
        await this.prisma.attribute.delete({
            where: { id },
        });
        return { message: 'Attribute deleted successfully' };
    }
    async createAttributeValue(attributeId, dto) {
        const attribute = await this.prisma.attribute.findUnique({
            where: { id: attributeId },
        });
        if (!attribute) {
            throw new common_1.NotFoundException('Attribute not found');
        }
        const existing = await this.prisma.attributeValue.findUnique({
            where: {
                attributeId_slug: {
                    attributeId,
                    slug: dto.slug,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Value with this slug already exists for this attribute');
        }
        if (dto.mediaId) {
            const media = await this.prisma.media.findUnique({
                where: { id: dto.mediaId },
            });
            if (!media) {
                throw new common_1.NotFoundException('Media not found');
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
    async getAttributeValues(attributeId) {
        const attribute = await this.prisma.attribute.findUnique({
            where: { id: attributeId },
        });
        if (!attribute) {
            throw new common_1.NotFoundException('Attribute not found');
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
    async getAttributeValueById(attributeId, valueId) {
        const value = await this.prisma.attributeValue.findUnique({
            where: { id: valueId },
            include: {
                attribute: true,
                media: true,
            },
        });
        if (!value || value.attributeId !== attributeId) {
            throw new common_1.NotFoundException('Attribute value not found');
        }
        return value;
    }
    async updateAttributeValue(attributeId, valueId, dto) {
        const value = await this.prisma.attributeValue.findUnique({
            where: { id: valueId },
        });
        if (!value || value.attributeId !== attributeId) {
            throw new common_1.NotFoundException('Attribute value not found');
        }
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
                throw new common_1.ConflictException('Value with this slug already exists for this attribute');
            }
        }
        if (dto.mediaId) {
            const media = await this.prisma.media.findUnique({
                where: { id: dto.mediaId },
            });
            if (!media) {
                throw new common_1.NotFoundException('Media not found');
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
    async deleteAttributeValue(attributeId, valueId) {
        const value = await this.prisma.attributeValue.findUnique({
            where: { id: valueId },
            include: {
                _count: {
                    select: { variantValues: true },
                },
            },
        });
        if (!value || value.attributeId !== attributeId) {
            throw new common_1.NotFoundException('Attribute value not found');
        }
        if (value._count.variantValues > 0) {
            throw new common_1.BadRequestException('Cannot delete attribute value assigned to product variants');
        }
        await this.prisma.attributeValue.delete({
            where: { id: valueId },
        });
        return { message: 'Attribute value deleted successfully' };
    }
};
exports.AttributesService = AttributesService;
exports.AttributesService = AttributesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], AttributesService);
//# sourceMappingURL=attributes.service.js.map