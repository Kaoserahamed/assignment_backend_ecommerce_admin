import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: DatabaseService) {}

  async createUser(dto: CreateUserDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Verify role exists
    const role = await this.prisma.role.findUnique({
      where: { id: dto.roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        active: dto.active ?? true,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    // Remove password from response
    const { password, refreshToken, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async getAllUsers(page = 1, limit = 10, search?: string, roleId?: string, active?: boolean) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (roleId) {
      where.roleId = roleId;
    }

    if (active !== undefined) {
      where.active = active;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          role: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    // Remove password and refreshToken from results
    const sanitizedUsers = users.map(({ password, refreshToken, ...user }) => user);

    return {
      data: sanitizedUsers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: {
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
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove password and refreshToken
    const { password, refreshToken, ...userWithoutSensitive } = user;

    return userWithoutSensitive;
  }

  async updateUser(id: string, dto: UpdateUserDto, currentUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent self-escalation: users cannot change their own role
    if (id === currentUserId && dto.roleId && dto.roleId !== user.roleId) {
      throw new ForbiddenException('You cannot change your own role');
    }

    // Check email uniqueness if email is being updated
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Verify new role exists if role is being updated
    if (dto.roleId) {
      const role = await this.prisma.role.findUnique({
        where: { id: dto.roleId },
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }
    }

    const updateData: any = { ...dto };

    // Hash password if it's being updated
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
      },
    });

    // Remove password and refreshToken
    const { password, refreshToken, ...userWithoutSensitive } = updated;

    return userWithoutSensitive;
  }

  async deleteUser(id: string, currentUserId: string) {
    // Prevent self-deletion
    if (id === currentUserId) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}
