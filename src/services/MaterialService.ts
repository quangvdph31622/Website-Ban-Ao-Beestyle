import { IMaterial } from "@/types/IMaterial";
import httpInstance from "@/utils/HttpInstance";

export const URL_API_MATERIAL = {
    get: '/admin/material',
    option: '/admin/material/material-options',
    create: '/admin/material/create',
    update: '/admin/material/update',
    delete: '/admin/material/delete',
};

export const getMaterials = async (url:string) => {
    const response = await httpInstance.get(url);
    return response.data;
}

export const createMaterial = async (data: IMaterial) => {
    const response = await httpInstance.post(URL_API_MATERIAL.create, data);
    return response.data;
}

export const updateMaterial = async (data: IMaterial) => {
    const response = await httpInstance.put(`${URL_API_MATERIAL.update}/${data.id}`, data);
    return response.data;
}
