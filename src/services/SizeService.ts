import httpInstance from "@/utils/HttpInstance";
import {ISize} from "@/types/ISize";

export const URL_API_SIZE = {
    get: '/admin/size',
    option: '/admin/size/size-options',
    create: '/admin/size/create',
    update: '/admin/size/update',
    delete: '/admin/size/delete',
};

export const getSizes = async (url: string) => {
    const response = await httpInstance.get(url);
    return response.data;
}

export const createSize = async (data: ISize) => {
    const response = await httpInstance.post(URL_API_SIZE.create, data);
    return response.data;
}

export const updateSize = async (data: ISize) => {
    const response = await httpInstance.put(`${URL_API_SIZE.update}/${data.id}`, data);
    return response.data;
}