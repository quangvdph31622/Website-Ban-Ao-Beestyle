import httpInstance from "@/utils/HttpInstance";
import {ICategory} from "@/types/ICategory";

export const URL_API_CATEGORY = {
    option: '/admin/category/category-options',
    get: '/admin/category',
    create: '/admin/category/create',
    update: '/admin/category/update',
    delete: '/admin/category/delete',
};

export const getCategories = async (url: string) => {
    const response = await httpInstance.get(url);
    return response.data;
}

export const getCategoryOptions = async (url: string) => {
    const response = await httpInstance.get(url);
    return response.data;
}

export const createCategory = async (data: ICategory) => {
    const response = await httpInstance.post(URL_API_CATEGORY.create, data);
    return response.data;
}

export const updateCategory = async (data: ICategory) => {
    const response = await httpInstance.put(`${URL_API_CATEGORY.update}/${data.id}`, data);
    return response.data;
}