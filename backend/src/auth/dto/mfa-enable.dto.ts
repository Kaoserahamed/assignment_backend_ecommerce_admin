import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class MfaEnableDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsBoolean()
  enable?: boolean;
}

export class MfaVerifyDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class MfaDisableDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class MfaSetupResponseDto {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}
