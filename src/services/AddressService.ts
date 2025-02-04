import {IAddress} from "@/types/IAddress"
import httpInstance from "@/utils/HttpInstance"

export const URL_API_ADDRESS = {
    provinces: "https://esgoo.net/api-tinhthanh/1/0.htm",
    districts: (provinceCode: string) => `https://esgoo.net/api-tinhthanh/2/${provinceCode}.htm`,
    wards: (districtCode: string) => `https://esgoo.net/api-tinhthanh/3/${districtCode}.htm`,

    get: '/admin/address',
    create: '/admin/address/create',
    update: '/admin/address/update',
    delete: '/admin/address/delete',
    isDefault: '/admin/address'
}

export const createAddress = async (data: any) => {
    const response = await httpInstance.post(URL_API_ADDRESS.create, data)
    return response.data
}

export const getAddress = async (key: any) => {
    const response = await httpInstance.get(key)
    return response.data
}

export const setIsDefault = async (data: IAddress) => {
    const response = await httpInstance.put(`${URL_API_ADDRESS.isDefault}/${data.id}`, data);
    return response.data
}

export const getAddressByCustomerId = async (key: any) => {
    const response = await httpInstance.get(key);
    return response.data
}

export const updateAddress = async (data: any) => {
    const response = await httpInstance.put(`${URL_API_ADDRESS.update}/${data.id}`, data);
    return response.data;
}

export const deleteAddress = async (data: IAddress) => {
    const response = await httpInstance.delete(`${URL_API_ADDRESS.delete}/${data.id}`);
    return response.data;
}

  