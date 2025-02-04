import {IProductImage, IProductImageCreate} from "@/types/IProductImage";
import {IProductVariantCreate} from "@/types/IProductVariant";

export interface IProduct {
    id: number;
    productCode?: string;
    productName?: string;
    imageUrl?: string;
    totalProductInStock?: number;
    minSalePrice?: number;
    categoryId?: number;
    categoryName?: string;
    gender?: string;
    brandId?: number;
    brandName?: string;
    materialId?: number;
    materialName?: string;
    description?: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: number;
    updatedBy?: number;
}

export interface IProductCreate {
    productCode?: string;
    productName: string;
    categoryId?: number;
    gender?: string;
    brandId?: number;
    materialId?: number;
    description?: string;
    status?: string;
    productImages?: IProductImageCreate[];
    productVariants?: IProductVariantCreate[];
    createdBy?: number;
    updatedBy?: number;
}