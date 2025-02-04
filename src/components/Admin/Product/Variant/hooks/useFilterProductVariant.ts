import useSWR from "swr";
import {getProductVariantsByProductId, URL_API_PRODUCT_VARIANT} from "@/services/ProductVariantService";
import {useMemo} from "react";

export interface ParamFilterProductVariant {
    page?: number;
    size?: number;
    colorIds?: string[];
    sizeIds?: string[];
    minPrice?: number;
    maxPrice?: number;
}

const useFilterProductVariant = (productId: string | undefined, param: ParamFilterProductVariant) => {
    const paramString = useMemo(() => {
        const paramString = new URLSearchParams();

        Object.keys(param).forEach((key) => {
            const value = param[key as keyof ParamFilterProductVariant];
            if (value !== undefined && value !== null && value.toString() !== "") {
                paramString.append(key, value.toString());
            }
        });

        return paramString;
    }, [param]);

    const {data, error, isLoading} = useSWR(
        productId ? `${URL_API_PRODUCT_VARIANT.filter(productId)}?${paramString.toString()}` : null,
        getProductVariantsByProductId,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const dataOptionFilterProductVariant = !isLoading && data?.data ? data.data : [];
    return {dataOptionFilterProductVariant, error, isLoading};
}
export default useFilterProductVariant;