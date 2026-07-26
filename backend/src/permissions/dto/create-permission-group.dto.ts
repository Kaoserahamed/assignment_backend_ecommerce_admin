import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePermissionGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
