import useSWR from "swr";
import React from "react";
import {getBrands, URL_API_BRAND} from "@/services/BrandService";
import {IBrand} from "@/types/IBrand";

const transformData = (data: IBrand[]) => {
    return data.map((item: IBrand) => ({
        key: item.id.toString() as React.Key,
        value: item.id,
        label: item.brandName,
        title: item.brandName,
    }));
};

const useBrand = (isLoadOption: boolean) => {
    const {data, error, isLoading} = useSWR(
        isLoadOption ? `${URL_API_BRAND.option}` : null,
        getBrands,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const dataBrand = !isLoading && data?.data ? data.data : [];
    const dataOptionBrand = !isLoading && data?.data ? transformData(data.data) : [];

    return {dataBrand, dataOptionBrand, error, isLoading};
}
export default useBrand;