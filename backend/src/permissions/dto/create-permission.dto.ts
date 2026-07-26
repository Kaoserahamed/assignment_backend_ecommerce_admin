import { IsString, IsOptional, IsNotEmpty, MaxLength, IsUUID } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  groupId: string;
}
