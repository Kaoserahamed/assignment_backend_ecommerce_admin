import { IsString, IsOptional, IsBoolean, IsUUID, MaxLength } from 'class-validator';

export class UpdateBrandDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  logoId?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
