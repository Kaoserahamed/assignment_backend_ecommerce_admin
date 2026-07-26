import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateMediaDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  altText?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;
}
