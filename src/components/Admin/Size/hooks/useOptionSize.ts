import useSWR from "swr";
import React from "react";
import {getColors} from "@/services/ColorService";
import {URL_API_SIZE} from "@/services/SizeService";
import {ISize} from "@/types/ISize";

const transformData = (data: ISize[]) => {
    return data.map((item: any) => ({
        key: item.id.toString() as React.Key,
        value: item.id,
        label: item.sizeName,
        title: item.sizeName,
    }));
};

const useOptionSize = (isLoadOption: boolean) => {
    const {data, error, isLoading} = useSWR(
        isLoadOption ? `${URL_API_SIZE.option}` : null,
        getColors,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const dataOptionSize = !isLoading && data?.data ? transformData(data.data) : [];

    return {dataOptionSize, error, isLoading};
}
export default useOptionSize;