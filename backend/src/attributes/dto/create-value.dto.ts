import { IsString, IsOptional, IsUUID, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateAttributeValueDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  value: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  slug: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  referenceValue?: string; // hex color or other reference

  @IsUUID()
  @IsOptional()
  mediaId?: string; // for image type attributes
}
