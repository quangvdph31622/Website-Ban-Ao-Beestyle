import useSWR from "swr";
import React from "react";
import {getMaterials, URL_API_MATERIAL} from "@/services/MaterialService";
import {IMaterial} from "@/types/IMaterial";

const transformData = (data: IMaterial[]) => {
    return data.map((item) => ({
        key: item.id.toString() as React.Key,
        value: item.id,
        label: item.materialName,
        title: item.materialName,
    }));
};

const useMaterial = (isLoadOption: boolean) => {
    const {data, error, isLoading} = useSWR(
        isLoadOption ? `${URL_API_MATERIAL.option}` : null,
        getMaterials,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const dataMaterial = !isLoading && data?.data ? data.data : [];
    const dataOptionMaterial = !isLoading && data?.data ? transformData(data.data) : [];

    return {dataMaterial, dataOptionMaterial, error, isLoading};
}
export default useMaterial;