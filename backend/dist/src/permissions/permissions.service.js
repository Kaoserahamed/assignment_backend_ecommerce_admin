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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let PermissionsService = class PermissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPermissionGroup(dto) {
        const existing = await this.prisma.permissionGroup.findUnique({
            where: { name: dto.name },
        });
        if (existing) {
            throw new common_1.ConflictException('Permission group with this name already exists');
        }
        const group = await this.prisma.permissionGroup.create({
            data: dto,
            include: {
                permissions: true,
            },
        });
        return group;
    }
    async getAllPermissionGroups() {
        const groups = await this.prisma.permissionGroup.findMany({
            include: {
                permissions: true,
                _count: {
                    select: { permissions: true },
                },
            },
            orderBy: { name: 'asc' },
        });
        return groups;
    }
    async getPermissionGroupById(id) {
        const group = await this.prisma.permissionGroup.findUnique({
            where: { id },
            include: {
                permissions: true,
            },
        });
        if (!group) {
            throw new common_1.NotFoundException('Permission group not found');
        }
        return group;
    }
    async updatePermissionGroup(id, dto) {
        const group = await this.prisma.permissionGroup.findUnique({
            where: { id },
        });
        if (!group) {
            throw new common_1.NotFoundException('Permission group not found');
        }
        if (dto.name) {
            const existing = await this.prisma.permissionGroup.findUnique({
                where: { name: dto.name },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Permission group with this name already exists');
            }
        }
        const updated = await this.prisma.permissionGroup.update({
            where: { id },
            data: dto,
            include: {
                permissions: true,
            },
        });
        return updated;
    }
    async deletePermissionGroup(id) {
        const group = await this.prisma.permissionGroup.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { permissions: true },
                },
            },
        });
        if (!group) {
            throw new common_1.NotFoundException('Permission group not found');
        }
        if (group._count.permissions > 0) {
            throw new common_1.BadRequestException('Cannot delete permission group with existing permissions');
        }
        await this.prisma.permissionGroup.delete({
            where: { id },
        });
        return { message: 'Permission group deleted successfully' };
    }
    async createPermission(dto) {
        const group = await this.prisma.permissionGroup.findUnique({
            where: { id: dto.groupId },
        });
        if (!group) {
            throw new common_1.NotFoundException('Permission group not found');
        }
        const existing = await this.prisma.permission.findUnique({
            where: { name: dto.name },
        });
        if (existing) {
            throw new common_1.ConflictException('Permission with this name already exists');
        }
        const permission = await this.prisma.permission.create({
            data: dto,
            include: {
                group: true,
            },
        });
        return permission;
    }
    async getAllPermissions(groupId) {
        const permissions = await this.prisma.permission.findMany({
            where: groupId ? { groupId } : undefined,
            include: {
                group: true,
            },
            orderBy: [{ group: { name: 'asc' } }, { name: 'asc' }],
        });
        return permissions;
    }
    async getPermissionById(id) {
        const permission = await this.prisma.permission.findUnique({
            where: { id },
            include: {
                group: true,
            },
        });
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
        }
        return permission;
    }
    async updatePermission(id, dto) {
        const permission = await this.prisma.permission.findUnique({
            where: { id },
        });
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
        }
        if (dto.groupId) {
            const group = await this.prisma.permissionGroup.findUnique({
                where: { id: dto.groupId },
            });
            if (!group) {
                throw new common_1.NotFoundException('Permission group not found');
            }
        }
        if (dto.name) {
            const existing = await this.prisma.permission.findUnique({
                where: { name: dto.name },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Permission with this name already exists');
            }
        }
        const updated = await this.prisma.permission.update({
            where: { id },
            data: dto,
            include: {
                group: true,
            },
        });
        return updated;
    }
    async deletePermission(id) {
        const permission = await this.prisma.permission.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { roles: true },
                },
            },
        });
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
        }
        if (permission._count.roles > 0) {
            throw new common_1.BadRequestException('Cannot delete permission assigned to roles');
        }
        await this.prisma.permission.delete({
            where: { id },
        });
        return { message: 'Permission deleted successfully' };
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map