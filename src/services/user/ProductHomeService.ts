import httpInstance from "@/utils/HttpInstance";
import useSWR from "swr";

export const URL_API_PRODUCT_AREA = 'product';
export const URL_API_PRODUCT_SELLER = 'product/seller';
export const URL_API_PRODUCT_OFFER = 'product/offer';
export const URL_API_PRODUCT_SEARCH = 'product/search';

const fetcher = async (url: string) => {
    const response = await httpInstance.get(url);
    return response.data.data.content;
};

const configSwr = {
    refreshInterval: 15 * 60 * 1000,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
}

export const findProduct = async (url: string) => {
    const response = await httpInstance.get(url);
    return response.data;
};

export const useProducts = (param?: string) => {
    const apiUrl = URL_API_PRODUCT_AREA;
    const fetchUrl = param ? `${apiUrl}?q=${param}` : apiUrl;

    const { data, error, isLoading, mutate } = useSWR(
        param !== undefined ? [apiUrl, param] : null,
        () => fetcher(fetchUrl),
        configSwr
    );

    return { products: data, error, isLoading, mutate };
};

export const useSellingProducts = () => {
    const { data: products, error, isLoading } = useSWR(
        URL_API_PRODUCT_SELLER,
        fetcher,
        { ...configSwr }
    );
    return { products, error, isLoading };
};

export const useOfferingProducts = () => {
    const { data: products, error, isLoading } = useSWR(
        URL_API_PRODUCT_OFFER,
        fetcher,
        { ...configSwr }
    );
    return { products, error, isLoading };
};
