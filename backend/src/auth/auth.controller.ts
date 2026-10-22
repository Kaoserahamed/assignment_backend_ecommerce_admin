import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from '@ecommerce/shared';
import { CurrentUser } from '@ecommerce/shared';
import { JwtAuthGuard } from '@ecommerce/shared';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { MfaService } from './mfa.service';
import { GoogleOAuth2Strategy } from './strategies/google.strategy';
import { GithubOAuth2Strategy } from './strategies/github.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mfaService: MfaService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user.userId);
  }

  @Get('session')
  @UseGuards(JwtAuthGuard)
  async getSession(@CurrentUser() user: any) {
    return this.authService.getSession(user.userId);
  }

  // OAuth2 - Google
  @Public()
  @Get('google')
  @UseGuards(GoogleOAuth2Strategy as any)
  async googleLogin(@Request() req: any) {
    // Redirect handled by passport
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOAuth2Strategy as any)
  async googleCallback(@Request() req: any) {
    return this.authService.oauthLogin(req.user);
  }

  // OAuth2 - GitHub
  @Public()
  @Get('github')
  @UseGuards(GithubOAuth2Strategy as any)
  async githubLogin(@Request() req: any) {
    // Redirect handled by passport
  }

  @Public()
  @Get('github/callback')
  @UseGuards(GithubOAuth2Strategy as any)
  async githubCallback(@Request() req: any) {
    return this.authService.oauthLogin(req.user);
  }

  // OAuth2 manual (for mobile/SPA)
  @Public()
  @Post('oauth')
  async oauthLogin(@Body() oauthDto: OAuthLoginDto) {
    return this.authService.oauthLoginManual(oauthDto);
  }

  // MFA endpoints
  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  async mfaSetup(@CurrentUser() user: any) {
    return this.mfaService.generateMfaSetup(user.userId);
  }

  @Post('mfa/enable')
  @UseGuards(JwtAuthGuard)
  async mfaEnable(@CurrentUser() user: any, @Body() dto: any) {
    return this.mfaService.enableMfa(user.userId, dto.password, dto.token);
  }

  @Post('mfa/disable')
  @UseGuards(JwtAuthGuard)
  async mfaDisable(@CurrentUser() user: any, @Body() dto: any) {
    return this.mfaService.disableMfa(user.userId, dto.password);
  }

  @Post('mfa/verify')
  @UseGuards(JwtAuthGuard)
  async mfaVerify(@CurrentUser() user: any, @Body() dto: any) {
    return this.mfaService.verifyMfaToken(user.userId, dto.token);
  }
}
