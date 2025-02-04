"use client";
import useSWR from "swr";
import axios from "axios";
import useAppNotifications from "@/hooks/useAppNotifications";
import {URL_API_ADDRESS} from "@/services/AddressService";
import React from "react";

// example
// {
//     "id": "89",
//     "name": "An Giang",
//     "name_en": "An Giang",
//     "full_name": "Tỉnh An Giang",
//     "full_name_en": "An Giang Province",
//     "latitude": "10.5392057",
//     "longitude": "105.2312822"
// }
const transformData = (data: any[]) => {
    return data.map((item) => ({
        key: item.id.toString() as React.Key,
        value: item.id,
        label: item.full_name,
        title: item.name,
    }));
};

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const useAddress = () => {
    const {showNotification} = useAppNotifications();

    const fetchApiAdress = (key: string | null, description: string) => {
        const {data, error, isLoading, mutate} = useSWR(key, fetcher, {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        });

        if (error) {
            showNotification("error", {
                message: error?.message, description: error?.response?.data?.message || `Error fetching ${description}`,
            });
        }

        return {data, error, isLoading, mutate};
    }

    const handleGetProvinces = () => {


        const {data, error, isLoading, mutate} =
            fetchApiAdress(URL_API_ADDRESS.provinces, 'provinces');

        const dataProvinces = !isLoading && data?.data ? data.data : [];
        const dataOptionProvinces = !isLoading && data?.data ? transformData(data.data) : [];

        return {dataProvinces, dataOptionProvinces, error, isLoading, mutate};
    }

    const handleGetDistricts = (provinceCode: string | undefined) => {
        const {data, error, isLoading, mutate} =
            fetchApiAdress(provinceCode ? URL_API_ADDRESS.districts(provinceCode) : null, 'districts');

        const dataDistricts = !isLoading && data?.data ? data.data : [];
        const dataOptionDistricts = !isLoading && data?.data ? transformData(data.data) : [];

        return {dataDistricts, dataOptionDistricts, error, isLoading, mutate};
    }

    const handleGetWards = (districtCode: string | undefined) => {
        const {data, error, isLoading, mutate} =
            fetchApiAdress(districtCode ? URL_API_ADDRESS.wards(districtCode) : null, 'wards');

        const dataWards = !isLoading && data?.data ? data.data : [];
        const dataOptionWards = !isLoading && data?.data ? transformData(data.data) : [];

        return {dataWards, dataOptionWards, error, isLoading, mutate};
    }

    return {handleGetProvinces, handleGetDistricts, handleGetWards};
};

export default useAddress;
