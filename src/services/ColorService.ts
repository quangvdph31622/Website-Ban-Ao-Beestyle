import httpInstance from "@/utils/HttpInstance";
import {IColor} from "@/types/IColor";

export const URL_API_COLOR = {
    get: '/admin/color',
    option: '/admin/color/color-options',
    create: '/admin/color/create',
    update: '/admin/color/update',
    delete: '/admin/color/delete',
};

export const getColors = async (url: string) => {
    const response = await httpInstance.get(url);
    return response.data;
}

export const createColor = async (data: IColor) => {
    const response = await httpInstance.post(URL_API_COLOR.create, data);
    return response.data;
}

export const updateColor = async (data: IColor) => {
    const response = await httpInstance.put(`${URL_API_COLOR.update}/${data.id}`, data);
    return response.data;
}