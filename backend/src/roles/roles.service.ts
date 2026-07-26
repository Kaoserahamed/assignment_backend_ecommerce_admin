import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: DatabaseService) {}

  async createRole(dto: CreateRoleDto) {
    const existing = await this.prisma.role.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Role with this name already exists');
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

  async getAllRoles(includeInactive?: boolean) {
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

  async getRoleById(id: string) {
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
      throw new NotFoundException('Role not found');
    }

    return {
      ...role,
      permissionCount: role.permissions.length,
      userCount: role._count.users,
    };
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (dto.name) {
      const existing = await this.prisma.role.findUnique({
        where: { name: dto.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Role with this name already exists');
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

  async deleteRole(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role._count.users > 0) {
      throw new BadRequestException('Cannot delete role with assigned users');
    }

    await this.prisma.role.delete({
      where: { id },
    });

    return { message: 'Role deleted successfully' };
  }

  async assignPermissions(roleId: string, dto: AssignPermissionsDto) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Verify all permissions exist
    const permissions = await this.prisma.permission.findMany({
      where: { id: { in: dto.permissionIds } },
    });

    if (permissions.length !== dto.permissionIds.length) {
      throw new BadRequestException('One or more permissions not found');
    }

    // Use transaction to remove old and add new permissions
    await this.prisma.$transaction(async (tx) => {
      // Remove existing permissions
      await tx.rolePermission.deleteMany({
        where: { roleId },
      });

      // Add new permissions
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

  async getRolePermissions(roleId: string) {
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
      throw new NotFoundException('Role not found');
    }

    return role.permissions.map((rp) => rp.permission);
  }
}
