export interface IOrderItem {
    id: number;
    orderId?: number;
    productVariantId: number;
    sku?: string;
    productId: number;
    productName?: string;
    colorId?: number;
    colorCode?: string;
    colorName?: string;
    sizeId?: number;
    sizeName?: string;
    promotionId?: number
    quantity: number;
    salePrice?: number;
    discountPrice?: number;
    note?: string;
}

export interface ICreateOrUpdateOrderItem {
    id?: number;
    orderId?: number;
    productVariantId?: number;
    quantity?: number;
    salePrice?: number;
    discountPrice?: number;
    note?: string;
}
