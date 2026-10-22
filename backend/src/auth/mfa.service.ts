import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MfaService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  generateSecret(userId: string): { secret: string; qrCodeUrl: string } {
    const secret = speakeasy.generateSecret({
      name: `E-Commerce Admin (${userId})`,
      issuer: 'E-Commerce Admin',
    });

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url || '',
    };
  }

  async generateQrCode(otpauthUrl: string): Promise<string> {
    return QRCode.toDataURL(otpauthUrl);
  }

  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1,
    });
  }

  generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 8; i++) {
      codes.push(this.generateRandomCode());
    }
    return codes;
  }

  private generateRandomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async enableMfa(userId: string, password: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Verify TOTP token
    if (!user.mfaSecret) {
      throw new BadRequestException('MFA not set up. Please generate a secret first.');
    }

    const isValid = this.verifyToken(user.mfaSecret, token);
    if (!isValid) {
      throw new BadRequestException('Invalid verification token');
    }

    const backupCodes = this.generateBackupCodes();

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: true,
        mfaRecoveryCodes: JSON.stringify(backupCodes),
      },
    });

    return {
      message: 'MFA enabled successfully',
      backupCodes,
    };
  }

  async disableMfa(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaRecoveryCodes: null,
      },
    });

    return { message: 'MFA disabled successfully' };
  }

  async verifyMfaToken(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      return false;
    }

    // Check TOTP token
    if (this.verifyToken(user.mfaSecret, token)) {
      return true;
    }

    // Check backup codes
    if (user.mfaRecoveryCodes) {
      const backupCodes: string[] = JSON.parse(user.mfaRecoveryCodes);
      const codeIndex = backupCodes.indexOf(token);
      if (codeIndex !== -1) {
        // Remove used backup code
        backupCodes.splice(codeIndex, 1);
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            mfaRecoveryCodes: JSON.stringify(backupCodes),
          },
        });
        return true;
      }
    }

    return false;
  }

  async generateMfaSetup(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.mfaEnabled) {
      throw new BadRequestException('MFA is already enabled');
    }

    const { secret, qrCodeUrl } = this.generateSecret(userId);

    // Store secret temporarily (not enabled yet)
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret },
    });

    return {
      secret,
      qrCodeUrl,
      backupCodes: this.generateBackupCodes(),
    };
  }
}
