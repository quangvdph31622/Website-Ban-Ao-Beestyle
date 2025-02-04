import httpInstance from "@/utils/HttpInstance";
import useSWR from 'swr';

interface ProductVariant {
    id: string;
    productId: string;
    productName: string;
    productCode: string;
    salePrice: number;
    discountPrice: number;
    discountValue: number;
    sku: string;
    colorName: string | null;
    colorCode: string | null;
    sizeName: string | null;
    categoryName: string | null;
    brandName: string | null;
    quantityInStock: number | 0;
    images: [];
    image?: string | null;
}

interface ProductImage {
    id: string;
    url: string;
    isDefault?: boolean;
}

interface ProductColor {
    colorCode(colorCode: string): unknown;
    colorName(colorName: string): unknown;
    id: string;
    name: string;
    code: string;
}

interface ProductSize {
    id: string;
    sizeName: string;
}

interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}

export type {
    ProductVariant,
    ProductImage,
    ProductColor,
    ProductSize,
    ApiResponse
};

export const URL_API_PRODUCT_IMAGE = (productId: string): string => {
    return `/product/${productId}/variant/image`;
};

export const URL_API_PRODUCT_COLOR = (productId: string): string => {
    return `/product/${productId}/variant/color`;
};

export const URL_API_PRODUCT_SIZE = (productId: number, colorCode: string): string => {
    return `/product/${productId}/variant/size?c=${encodeURIComponent(colorCode)}`;
};

export const handleFetchProduct = (productId: number, color?: string, size?: string): string => {
    let url = `/product/${productId}/variant`;

    if (color || size) {
        const params: Record<string, string> = {};
        if (color) params.c = color;
        if (size) params.s = size;
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
    }

    return url;
};

export const getProduct = async (
    productId: number,
    color?: string,
    size?: string
): Promise<ProductVariant> => {
    const url = handleFetchProduct(productId, color, size);
    const response = await httpInstance.get<ApiResponse<ProductVariant>>(url);
    return response.data.data;
};

export const getColorSingleProduct = async (productId: string): Promise<ProductColor[]> => {
    const url = URL_API_PRODUCT_COLOR(productId);
    const response = await httpInstance.get<ApiResponse<ProductColor[]>>(url);
    return response.data.data;
};

export const getSizeSingleProduct = async (productId: number, colorCode: string): Promise<ProductSize[]> => {
    const url = URL_API_PRODUCT_SIZE(productId, colorCode);
    const response = await httpInstance.get<ApiResponse<ProductSize[]>>(url);
    return response.data.data;
};

const configSwr = {
    refreshInterval: 15 * 60 * 1000,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
}

export const useProduct = (productId: number, color?: string, size?: string) => {
    return useSWR(
        productId ? handleFetchProduct(productId, color, size) : null,
        () => getProduct(productId, color, size),
        { ...configSwr }
    );
};

export const useProductColors = (productId: string) => {
    return useSWR(
        productId ? URL_API_PRODUCT_COLOR(productId) : null,
        () => getColorSingleProduct(productId),
        { ...configSwr }
    );
};

export const useProductSizes = (productId: number, colorCode: string) => {
    return useSWR(
        productId && colorCode ? URL_API_PRODUCT_SIZE(productId, colorCode) : null,
        () => getSizeSingleProduct(productId, colorCode),
        { ...configSwr }
    );
};
