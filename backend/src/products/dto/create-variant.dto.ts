import { IsString, IsNotEmpty, IsNumber, IsArray, IsUUID, IsOptional, IsIn, IsInt, IsBoolean, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  salePrice?: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['in_stock', 'out_of_stock', 'low_stock'])
  stockStatus: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  lowStockThreshold?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  weight?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  attributeValueIds: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  mediaIds?: string[];
}
