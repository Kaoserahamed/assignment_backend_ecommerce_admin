import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsUUID, IsIn, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  slug?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  sku?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  longDescription?: string;

  @IsBoolean()
  @IsOptional()
  hasVariants?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  salePrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @IsString()
  @IsOptional()
  @IsIn(['in_stock', 'out_of_stock', 'low_stock'])
  stockStatus?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  weight?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sortOrder?: number;

  @IsUUID()
  @IsOptional()
  brandId?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  categoryIds?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  mediaIds?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  attributeIds?: string[];
}
