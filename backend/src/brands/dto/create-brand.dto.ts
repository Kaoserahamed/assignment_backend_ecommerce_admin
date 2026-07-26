import { IsString, IsOptional, IsBoolean, IsUUID, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  slug: string;

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
