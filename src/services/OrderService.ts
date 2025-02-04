import httpInstance from "@/utils/HttpInstance";
import {IOrderCreateOrUpdate, IOrderOnlineCreateOrUpdate} from "@/types/IOrder";

export const URL_API_ORDER = {
    getOrderPending: '/admin/order/order-pending',
    getOrderDetail: (id: number) => `/admin/order/${id}`,
    filter: '/admin/order',
    create: '/admin/order/create',
    checkout: '/checkout',
    update: (id: number) => `/admin/order/update/${id}`,
    updateOrderStatus: (id: number) => `/admin/order/${id}/update-status`,
    orderByCustomer: `/orders-by-customer`,
    getOrderDetailByOrderTrackingNumber: (orderTrackingNumber: string) => `/order-by-customer/${orderTrackingNumber}`,
};

export const getOrders = async (url: string) => {
    const response = await httpInstance.get(url);
    return response.data;
}

export const createOrder = async (data: IOrderCreateOrUpdate) => {
    const response = await httpInstance.post(URL_API_ORDER.create, data);
    return response.data;
}

export const createOrderOnline = async (data: IOrderOnlineCreateOrUpdate) => {
    const response = await httpInstance.post(URL_API_ORDER.checkout, data);
    return response.data;
}

export const updateOrder = async (data: IOrderCreateOrUpdate, id: number) => {
    const response = await httpInstance.post(URL_API_ORDER.update(id), data);
    return response.data;
}

export const updateOrderStatus = async (id: number, data: {
    shippingFee?: number | undefined,
    totalAmount?: number,
    orderStatus: string,
    note: string | undefined
}) => {
    const response = await httpInstance.post(URL_API_ORDER.updateOrderStatus(id), data);
    return response.data;
}
