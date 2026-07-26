export declare class CreateVariantDto {
    sku: string;
    price: number;
    salePrice?: number;
    stock: number;
    stockStatus: string;
    lowStockThreshold?: number;
    weight?: number;
    active?: boolean;
    attributeValueIds: string[];
    mediaIds?: string[];
}
