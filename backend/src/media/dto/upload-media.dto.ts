import { IsString, IsOptional, IsIn, MaxLength } from 'class-validator';

export class UploadMediaDto {
  @IsString()
  @IsIn(['image', 'video'])
  type: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  altText?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;
}
