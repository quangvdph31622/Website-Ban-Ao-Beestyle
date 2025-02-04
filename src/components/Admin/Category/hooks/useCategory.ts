import useSWR from "swr";
import {getCategoryOptions, URL_API_CATEGORY} from "@/services/CategoryService";
import React from "react";

const transformData = (data: any) => {
    return data.map((item: any) => ({
        key: item.id.toString() as React.Key,
        title: item.categoryName,
        value: item.id,
        children: transformData(item.categoryChildren),
    }));
};

const useCategory = (isLoadTree: boolean) => {
    const {data, error, isLoading} = useSWR(
        isLoadTree ? URL_API_CATEGORY.option : null,
        getCategoryOptions,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const dataCategory = !isLoading && data?.data ? data.data : [];
    const dataTreeSelectCategory = !isLoading && data?.data ? transformData(data?.data) : [];

    return {dataCategory, dataTreeSelectCategory, error, isLoading};
}

export default useCategory;