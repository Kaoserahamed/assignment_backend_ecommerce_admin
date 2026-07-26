export declare class CreateProductDto {
    name: string;
    slug: string;
    sku?: string;
    shortDescription?: string;
    longDescription?: string;
    hasVariants?: boolean;
    price?: number;
    salePrice?: number;
    stock?: number;
    stockStatus?: string;
    weight?: number;
    active?: boolean;
    featured?: boolean;
    sortOrder?: number;
    brandId?: string;
    categoryIds?: string[];
    mediaIds?: string[];
    attributeIds?: string[];
}
