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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let RolesService = class RolesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRole(dto) {
        const existing = await this.prisma.role.findUnique({
            where: { name: dto.name },
        });
        if (existing) {
            throw new common_1.ConflictException('Role with this name already exists');
        }
        const role = await this.prisma.role.create({
            data: {
                name: dto.name,
                description: dto.description,
                status: dto.status ?? true,
            },
            include: {
                permissions: {
                    include: {
                        permission: {
                            include: {
                                group: true,
                            },
                        },
                    },
                },
            },
        });
        return role;
    }
    async getAllRoles(includeInactive) {
        const roles = await this.prisma.role.findMany({
            where: includeInactive ? undefined : { status: true },
            include: {
                permissions: {
                    include: {
                        permission: {
                            include: {
                                group: true,
                            },
                        },
                    },
                },
                _count: {
                    select: { users: true },
                },
            },
            orderBy: { name: 'asc' },
        });
        return roles.map((role) => ({
            ...role,
            permissionCount: role.permissions.length,
            userCount: role._count.users,
        }));
    }
    async getRoleById(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: {
                permissions: {
                    include: {
                        permission: {
                            include: {
                                group: true,
                            },
                        },
                    },
                },
                _count: {
                    select: { users: true },
                },
            },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        return {
            ...role,
            permissionCount: role.permissions.length,
            userCount: role._count.users,
        };
    }
    async updateRole(id, dto) {
        const role = await this.prisma.role.findUnique({
            where: { id },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        if (dto.name) {
            const existing = await this.prisma.role.findUnique({
                where: { name: dto.name },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Role with this name already exists');
            }
        }
        const updated = await this.prisma.role.update({
            where: { id },
            data: dto,
            include: {
                permissions: {
                    include: {
                        permission: {
                            include: {
                                group: true,
                            },
                        },
                    },
                },
            },
        });
        return updated;
    }
    async deleteRole(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { users: true },
                },
            },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        if (role._count.users > 0) {
            throw new common_1.BadRequestException('Cannot delete role with assigned users');
        }
        await this.prisma.role.delete({
            where: { id },
        });
        return { message: 'Role deleted successfully' };
    }
    async assignPermissions(roleId, dto) {
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        const permissions = await this.prisma.permission.findMany({
            where: { id: { in: dto.permissionIds } },
        });
        if (permissions.length !== dto.permissionIds.length) {
            throw new common_1.BadRequestException('One or more permissions not found');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.rolePermission.deleteMany({
                where: { roleId },
            });
            await tx.rolePermission.createMany({
                data: dto.permissionIds.map((permissionId) => ({
                    roleId,
                    permissionId,
                })),
            });
        });
        const updated = await this.prisma.role.findUnique({
            where: { id: roleId },
            include: {
                permissions: {
                    include: {
                        permission: {
                            include: {
                                group: true,
                            },
                        },
                    },
                },
            },
        });
        return updated;
    }
    async getRolePermissions(roleId) {
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
            include: {
                permissions: {
                    include: {
                        permission: {
                            include: {
                                group: true,
                            },
                        },
                    },
                },
            },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        return role.permissions.map((rp) => rp.permission);
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], RolesService);
//# sourceMappingURL=roles.service.js.map