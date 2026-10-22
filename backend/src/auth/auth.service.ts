import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { MfaService } from './mfa.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mfaService: MfaService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
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

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.active) {
      throw new UnauthorizedException('Account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If MFA is enabled, require MFA verification before issuing tokens
    if (user.mfaEnabled) {
      return {
        requiresMfa: true,
        userId: user.id,
        message: 'MFA verification required',
      };
    }

    return this.issueTokens(user);
  }

  async verifyMfaLogin(userId: string, token: string) {
    const isValid = await this.mfaService.verifyMfaToken(userId, token);

    if (!isValid) {
      throw new UnauthorizedException('Invalid MFA token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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

    if (!user || !user.active) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return this.issueTokens(user);
  }

  private async issueTokens(user: any) {
    const permissions = user.role.permissions.map((rp) => rp.permission.name);

    const payload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
      role: user.role.name,
      permissions,
      mfaEnabled: user.mfaEnabled,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'default-refresh-secret',
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d') as any,
    });

    // Store refresh token
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      requiresMfa: false,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        mfaEnabled: user.mfaEnabled,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
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

      if (!user || !user.active) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const permissions = user.role.permissions.map((rp) => rp.permission.name);

      const newPayload = {
        sub: user.id,
        email: user.email,
        roleId: user.roleId,
        role: user.role.name,
        permissions,
        mfaEnabled: user.mfaEnabled,
      };

      const accessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'default-refresh-secret',
        expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d') as any,
      });

      // Update refresh token
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return {
        requiresMfa: false,
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Logged out successfully' };
  }

  async getSession(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const permissions = user.role.permissions.map((rp) => rp.permission.name);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      avatar: user.avatar,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
      permissions,
      mfaEnabled: user.mfaEnabled,
    };
  }

  async oauthLogin(profile: any) {
    // Find or create user by provider ID or email
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: profile.email },
        ],
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

    if (!user) {
      // Create a new user with default "Vendor" role
      const vendorRole = await this.prisma.role.findFirst({
        where: { name: 'Vendor' },
      });

      if (!vendorRole) {
        throw new BadRequestException('Vendor role not configured');
      }

      const randomPassword = Math.random().toString(36).slice(-12);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await this.prisma.user.create({
        data: {
          name: profile.name || profile.email,
          email: profile.email,
          password: hashedPassword,
          active: true,
          roleId: vendorRole.id,
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
    }

    return this.issueTokens(user);
  }

  async oauthLoginManual(oauthDto: OAuthLoginDto) {
    // Manual OAuth2 login - find user by email and provider
    const user = await this.prisma.user.findUnique({
      where: { email: oauthDto.email },
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

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.active) {
      throw new UnauthorizedException('Account is inactive');
    }

    return this.issueTokens(user);
  }
}
