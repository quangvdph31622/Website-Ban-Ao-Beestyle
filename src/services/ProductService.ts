import httpInstance from "@/utils/HttpInstance";
import {IProduct, IProductCreate} from "@/types/IProduct";

export const URL_API_PRODUCT = {
    options: '/admin/product',
    get: '/admin/product',
    create: '/admin/product/create',
    update: '/admin/product/update',
    delete: '/admin/product/delete',
    search: '/admin/product/search',
    filter: '/admin/product/filter',
    productVariant: '/admin/productVariant',
    updateProductVariant: '/admin/productVariant/updates'
};

export const getProducts = async (url: string) => {
    const response = await httpInstance.get(url);
    return response.data;
}

export const createProduct = async (data: IProductCreate) => {
    const response = await httpInstance.post(URL_API_PRODUCT.create, data);
    return response.data;
}

export const updateProduct = async (data: IProduct) => {
    const response = await httpInstance.put(`${URL_API_PRODUCT.update}/${data.id}`, data);
    return response.data;
}


export const getProductDetails = async (productId: number) => {
    try {
        const response = await httpInstance.get(`${URL_API_PRODUCT.productVariant}?productIds=${productId}`);
        console.log("ShopProductGridComponent details:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching product details:", error);
        throw error;
    }
};

export const updateProductVariant = async (promotionId: number, variantIds: number[]) => {
    try {
        const response = await httpInstance.put(URL_API_PRODUCT.updateProductVariant, {
            promotionId,
            variantIds,
            status: "ACTIVE",
        });
        return response.data; // Trả về dữ liệu từ phản hồi
    } catch (error) {
        console.error("Error updating product variant:", error);
        throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm
    }
};



