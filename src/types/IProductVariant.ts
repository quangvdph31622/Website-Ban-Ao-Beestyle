export interface IProductVariant {
    id: number;
    sku?: string;
    productId: number;
    productName?: string;
    colorId?: number;
    colorCode?: string;
    colorName?: string;
    sizeId?: number;
    sizeName?: string;
    originalPrice?: number;
    salePrice?: number;
    quantityInStock?: number;
    status?: string
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: number;
    updatedBy?: number;
    promotionName?: string;
}

// dùng cho hiển thị lên bảng khi tạo bến thể
export interface IProductVariantRows{
    key: string
    sku?: string;
    productVariantName?: string;
    productId?: number;
    colorId?: number;
    sizeId?: number;
    originalPrice?: number;
    salePrice?: number;
    quantityInStock?: number;
}

// dùng khi lưu biến thể và db
export interface IProductVariantCreate{
    sku?: string;
    productId?: number;
    colorId?: number;
    sizeId?: number;
    originalPrice?: number;
    salePrice?: number;
    quantityInStock?: number;
}

// export interface IProductVariantInCart{
//     id: number;
//     sku?: string;
//     productId?: number;
//     productName?: string;
//     colorId?: number;
//     colorCode?: string;
//     colorName?: string;
//     sizeId?: number;
//     sizeName?: string;
//     quantity?: number;
//     salePrice?: number;
// }