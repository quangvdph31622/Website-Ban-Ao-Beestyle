import httpInstance from "@/utils/HttpInstance";
import {ISize} from "@/types/ISize";
import {IStatistical} from "../types/IStatistical";


export const URL_API_STATISTICAL = {
    getProductByStock: '/admin/statistics/filterByStock',
    getTopSellingProduct: '/admin/statistics/topSellingProduct',
     getRevenue: '/admin/statistics/revenue-by-period',
    getOrderStatus:'/admin/statistics/orderStatus-by-period'
};

export const getRevenues = async (url : string) => {
    const response = await httpInstance.get(url);
    return response.data;
}
export const getOrderStatus = async (url : string) => {
    const response = await httpInstance.get(url);
    return response.data;
}
export const getProductByStock = async (stock: number): Promise<IStatistical[]> => {
    try {
        const response = await httpInstance.get(`${URL_API_STATISTICAL.getProductByStock}?stock=${stock}`);
        return response.data; // Dữ liệu trả về có thể là mảng InventoryResponse
    } catch (error) {
        console.error("Error fetching products by stock:", error);
        throw error;
    }
};
export const getTopSellingProduct = async (top: number): Promise<IStatistical[]> => {
    try {
        const response = await httpInstance.get(`${URL_API_STATISTICAL.getTopSellingProduct}?top=${top}`);
        return response.data; // Dữ liệu trả về có thể là mảng InventoryResponse
    } catch (error) {
        console.error("Error fetching products by top:", error);
        throw error;
    }
};
