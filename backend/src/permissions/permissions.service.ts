import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: DatabaseService) {}

  // Permission Groups CRUD

  async createPermissionGroup(dto: CreatePermissionGroupDto) {
    const existing = await this.prisma.permissionGroup.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Permission group with this name already exists');
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

  async getPermissionGroupById(id: string) {
    const group = await this.prisma.permissionGroup.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Permission group not found');
    }

    return group;
  }

  async updatePermissionGroup(id: string, dto: UpdatePermissionGroupDto) {
    const group = await this.prisma.permissionGroup.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException('Permission group not found');
    }

    if (dto.name) {
      const existing = await this.prisma.permissionGroup.findUnique({
        where: { name: dto.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Permission group with this name already exists');
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

  async deletePermissionGroup(id: string) {
    const group = await this.prisma.permissionGroup.findUnique({
      where: { id },
      include: {
        _count: {
          select: { permissions: true },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Permission group not found');
    }

    if (group._count.permissions > 0) {
      throw new BadRequestException('Cannot delete permission group with existing permissions');
    }

    await this.prisma.permissionGroup.delete({
      where: { id },
    });

    return { message: 'Permission group deleted successfully' };
  }

  // Permissions CRUD

  async createPermission(dto: CreatePermissionDto) {
    const group = await this.prisma.permissionGroup.findUnique({
      where: { id: dto.groupId },
    });

    if (!group) {
      throw new NotFoundException('Permission group not found');
    }

    const existing = await this.prisma.permission.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Permission with this name already exists');
    }

    const permission = await this.prisma.permission.create({
      data: dto,
      include: {
        group: true,
      },
    });

    return permission;
  }

  async getAllPermissions(groupId?: string) {
    const permissions = await this.prisma.permission.findMany({
      where: groupId ? { groupId } : undefined,
      include: {
        group: true,
      },
      orderBy: [{ group: { name: 'asc' } }, { name: 'asc' }],
    });

    return permissions;
  }

  async getPermissionById(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        group: true,
      },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async updatePermission(id: string, dto: Partial<CreatePermissionDto>) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (dto.groupId) {
      const group = await this.prisma.permissionGroup.findUnique({
        where: { id: dto.groupId },
      });

      if (!group) {
        throw new NotFoundException('Permission group not found');
      }
    }

    if (dto.name) {
      const existing = await this.prisma.permission.findUnique({
        where: { name: dto.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Permission with this name already exists');
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

  async deletePermission(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        _count: {
          select: { roles: true },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (permission._count.roles > 0) {
      throw new BadRequestException('Cannot delete permission assigned to roles');
    }

    await this.prisma.permission.delete({
      where: { id },
    });

    return { message: 'Permission deleted successfully' };
  }
}
