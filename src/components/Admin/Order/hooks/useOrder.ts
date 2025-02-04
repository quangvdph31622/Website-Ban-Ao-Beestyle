import useAppNotifications from "@/hooks/useAppNotifications";
import {IOrder, IOrderCreateOrUpdate, IOrderDetail, IOrderedByUser, IOrderOnlineCreateOrUpdate} from "@/types/IOrder";
import {
    createOrder,
    createOrderOnline,
    getOrders,
    updateOrder,
    updateOrderStatus,
    URL_API_ORDER
} from "@/services/OrderService";
import {useState} from "react";
import useSWR from "swr";

const delay = () => new Promise<void>(res => setTimeout(() => res(), 200));

const useOrder = () => {
    const {showNotification, showMessage} = useAppNotifications();
    const [loading, setLoading] = useState<boolean>(false);

    const handleGetOrderDetail = (orderId: number | null) => {
        const {data, isLoading, error, mutate} = useSWR(
            orderId ? URL_API_ORDER.getOrderDetail(orderId) : null,
            getOrders,
            {
                revalidateIfStale: true,
                revalidateOnReconnect: false,
            }
        );

        if (error) {
            showNotification("error", {
                message: error?.message,
                description: error?.response?.data?.message || "Error fetching order detail",
            });
        }

        const orderDetail: IOrderDetail = data?.data ? data.data : undefined;

        return {orderDetail, isLoading, error, mutate};
    }

    const handleGetOrderDetailByOrderTrackingNumber = (orderTrackingNumber: string | null) => {
        const {data, isLoading, error, mutate} = useSWR(
            orderTrackingNumber ? URL_API_ORDER.getOrderDetailByOrderTrackingNumber(orderTrackingNumber) : null,
            getOrders,
            {
                revalidateIfStale: true,
                revalidateOnReconnect: false,
            }
        );

        if (error) {
            showNotification("error", {
                message: error?.message,
                description: error?.response?.data?.message || "Error fetching order detail",
            });
        }

        const orderDetail: IOrderDetail = data?.data ? data.data : undefined;

        return {orderDetail, isLoading, error, mutate};
    }

    const handleGetOrderByCustomer = (customerId: number, size: number, page: number) => {
        const {data, isLoading, error, mutate} = useSWR(
            `${URL_API_ORDER.orderByCustomer}?customerId=${customerId}&page=${page}&size=${size}`,
            getOrders,
            {
                revalidateOnReconnect: false,
                revalidateOnFocus: false
            }
        );

        if (error) {
            showNotification("error", {
                message: error?.message,
                description: error?.response?.data?.message || "Error fetching order tracking by customer",
            });
        }

        const orderedByUser = data?.data ? data.data : undefined;

        return {orderedByUser, isLoading, error, mutate};
    }


    const handleCreateOrder = async (value: IOrderCreateOrUpdate) => {
        setLoading(true);
        try {
            await delay();
            const result = await createOrder(value);
            if (result.data) showMessage("success", result.message);
            return result.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage && typeof errorMessage === 'object') {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", {message: String(message)});
                });
            } else {
                showNotification("error", {message: error?.message, description: errorMessage});
            }
            throw new Error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleCreateOrderOnline = async (value: IOrderOnlineCreateOrUpdate) => {
        setLoading(true);
        try {
            const result = await createOrderOnline(value);
            return result.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage && typeof errorMessage === 'object') {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", {message: String(message)});
                });
            } else {
                showNotification("error", {message: error?.message, description: errorMessage});
            }
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateOrder = async (value: IOrder, id: number) => {
        try {
            const result = await updateOrder(value, id);
            if (result.data) showNotification("success", {message: result.message});
            return result.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage && typeof errorMessage === 'object') {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", {message: String(message)});
                });
            } else {
                showNotification("error", {message: error?.message, description: errorMessage});
            }
            return null;
        }
    }


    const handleUpdateOrderStatusDelivery = async (id: number, value: {
        shippingFee?: number | undefined,
        totalAmount?: number,
        orderStatus: string,
        note: string | undefined
    }) => {
        setLoading(true);
        try {
            const result = await updateOrderStatus(id, value);
            if (result.data === "OK") {
                showNotification("success", {message: result.message});
                return result.data;
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage && typeof errorMessage === 'object') {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", {message: String(message)});
                });
            } else {
                showNotification("error", {message: error?.message, description: errorMessage});
            }
            throw new Error(errorMessage)
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        handleCreateOrder,
        handleCreateOrderOnline,
        handleUpdateOrderStatusDelivery,
        handleUpdateOrder,
        handleGetOrderDetail,
        handleGetOrderByCustomer,
        handleGetOrderDetailByOrderTrackingNumber
    };
}
export default useOrder;
