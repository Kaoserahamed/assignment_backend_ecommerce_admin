import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { MfaService } from './mfa.service';
import { JwtAuthGuard } from '@ecommerce/shared';
import { CurrentUser } from '@ecommerce/shared';

@Controller('auth/mfa')
export class MfaController {
  constructor(private readonly mfaService: MfaService) {}

  @Get('setup')
  @UseGuards(JwtAuthGuard)
  async setupMfa(@CurrentUser() user: any) {
    const setup = await this.mfaService.generateMfaSetup(user.userId);
    return {
      message: 'MFA setup initiated',
      secret: setup.secret,
      qrCodeUrl: setup.qrCodeUrl,
      backupCodes: setup.backupCodes,
    };
  }

  @Post('enable')
  @UseGuards(JwtAuthGuard)
  async enableMfa(
    @CurrentUser() user: any,
    @Body() dto: { password: string; token: string },
  ) {
    return this.mfaService.enableMfa(user.userId, dto.password, dto.token);
  }

  @Post('disable')
  @UseGuards(JwtAuthGuard)
  async disableMfa(
    @CurrentUser() user: any,
    @Body() dto: { password: string },
  ) {
    return this.mfaService.disableMfa(user.userId, dto.password);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verifyMfa(
    @CurrentUser() user: any,
    @Body() dto: { token: string },
  ) {
    const isValid = await this.mfaService.verifyMfaToken(user.userId, dto.token);
    return {
      valid: isValid,
      message: isValid ? 'Token verified successfully' : 'Invalid token',
    };
  }
}
