import httpInstance from "@/utils/HttpInstance";
import {ICreateOrUpdateOrderItem} from "@/types/IOrderItem";

export const URL_API_ORDER_ITEM = {
    get: (orderId: number) => `/admin/order/${orderId}/order-items`,
    create: `/admin/order-item/create`,
    creates: `/admin/order-item/creates`,
    create_delivery_sale: `admin/order-item/creates/delivery-sale`,
    update: (orderItemId?: string) => `/admin/order-item/${orderItemId}`,
    patchQuantity: `/admin/order-item/update-quantity`,
    delete: (orderItemId: string) => `/admin/order-item/${orderItemId}/delete`,
};

export const getOrderItemsByOrderId = async (url: string) => {
    const response = await httpInstance.get(url);
    return response.data;
}

export const createOrderItem = async (data: ICreateOrUpdateOrderItem) => {
    const response = await httpInstance.post(URL_API_ORDER_ITEM.create, data);
    return response.data;
}

export const createOrderItems = async (url: string, data: ICreateOrUpdateOrderItem[]) => {
    const response = await httpInstance.post(url, data);
    return response.data;
}

export const updateOrderItem = async (data: ICreateOrUpdateOrderItem) => {
    const response = await httpInstance.put(URL_API_ORDER_ITEM.update(data.id?.toString()), data);
    return response.data;
}

export const updateQuantityOrderItem = async (data: ICreateOrUpdateOrderItem) => {
    const response = await httpInstance.patch(URL_API_ORDER_ITEM.patchQuantity, data);
    return response.data;
}

export const deleteOrderItem = async (id: number) => {
    const response = await httpInstance.delete(URL_API_ORDER_ITEM.delete(id.toString()));
    return response.data;
}
