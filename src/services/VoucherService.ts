import httpInstance, { OptionsParams } from "@/utils/HttpInstance";
import { IVoucher } from "@/types/IVoucher";
import useSWR from "swr";


export const URL_API_VOUCHER = {
    get: '/admin/voucher',
    create: '/admin/voucher/create',
    update: '/admin/voucher/update',
    delete: '/admin/voucher/delete',
    search: '/admin/voucher/search',
    searchByDate: '/admin/voucher/findbydate',
    findByTotalAmount: '/admin/voucher/findByTotalAmount',
};

export const getVouchers = async (url: string) => {
    const response = await httpInstance.get(url);
    return response.data;
}

export const createVoucher = async (data: IVoucher) => {
    const response = await httpInstance.post(URL_API_VOUCHER.create, data);
    return response.data;
}

export const updateVoucher = async (data: IVoucher) => {
    const response = await httpInstance.put(`${URL_API_VOUCHER.update}/${data.id}`, data);
    return response.data;
}

export const deleteVoucher = async (id: number) => {
    const response = await httpInstance.delete(`${URL_API_VOUCHER.delete}/${id}`);
    return response.data;
}

export const findVouchers = async (searchTerm: string, page = 0, size = 10) => {
    const response = await httpInstance.get(`${URL_API_VOUCHER.search}`, {
        params: { searchTerm, page, size },
    });
    return response.data;
};

export const findVouchersByDate = async (startDate: any, endDate: any, page = 0, size = 10) => {
    const response = await httpInstance.get(`${URL_API_VOUCHER.searchByDate}`, {
        params: { startDate, endDate, page, size },
    });
    return response.data;

};

export const findVouchersByTotalAmount = async (totalAmount: number) => {
    const response = await httpInstance.get(URL_API_VOUCHER.findByTotalAmount, {
        params: { totalAmount },
    });
    return response.data;
};

export const useVoucherData = () => {
    const { data, error, isLoading, mutate } = useSWR<any>(
        URL_API_VOUCHER.get,
        getVouchers,
        { revalidateOnFocus: false }
    );

    const voucherItems = data?.data?.items || [];

    return {
        voucherItems,
        error,
        isLoading,
        mutate,
    };
};
