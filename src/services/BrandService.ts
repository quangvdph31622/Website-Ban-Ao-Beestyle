import httpInstance from "@/utils/HttpInstance";
import {IBrand} from "@/types/IBrand";

export const URL_API_BRAND = {
    get: '/admin/brand',
    option: '/admin/brand/brand-options',
    create: '/admin/brand/create',
    update: '/admin/brand/update',
    delete: '/admin/brand/delete',
};

export const getBrands = async (url: string) => {
    const response = await httpInstance.get(url);
    return response.data;
}

export const createBrand = async (data: IBrand) => {
    const response = await httpInstance.post(URL_API_BRAND.create, data);
    return response.data;
}

export const updateBrand = async (data: IBrand) => {
    const response = await httpInstance.put(`${URL_API_BRAND.update}/${data.id}`, data);
    return response.data;
}