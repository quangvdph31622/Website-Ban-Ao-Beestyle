export interface IProductImage {
    id: number,
    productId?: number,
    imageUrl?: string,
    isDefault?: boolean,
}

export interface IProductImageCreate {
    productId?: number,
    imageUrl?: string,
    isDefault?: boolean,
}