import useSWR from "swr";
import {getProducts} from "@/services/ProductService";
import {URL_API_ORDER} from "@/services/OrderService";

export interface ParamFilterOrder {
    page?: number;
    size?: number;
    keyword?: string;
    startDate?: string;
    endDate?: string;
    month?: number;
    year?: number;
    orderStatus?: string;
    orderChannel?: string;
    paymentMethod?: string;
};

const useFilterOrder = (param?: ParamFilterOrder) => {
    const paramString = new URLSearchParams();

    if (param) {
        Object.keys(param).forEach((key) => {
            const value = param[key as keyof ParamFilterOrder];
            if (value !== undefined && value !== null) {
                paramString.append(key, value.toString());
            }
        });
    }

    const {data, error, isLoading, mutate: mutateOrder} =
        useSWR(`${URL_API_ORDER.filter}?${paramString.toString()}`,
            getProducts,
            {
                revalidateOnReconnect: false,
            }
        );

    const dataFilterOrder = !isLoading && data?.data ? data.data : [];

    return {dataFilterOrder, error, isLoading, mutateOrder};

}
export default useFilterOrder;