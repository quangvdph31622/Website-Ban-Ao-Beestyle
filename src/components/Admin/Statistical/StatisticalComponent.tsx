import Title from "antd/lib/typography/Title";
import SalesStatistics from "./SalesStatistics";
import StatisticChart from "./StatisticChart";
import StatisticTables from "./StatisticTables";
import useSWR from "swr";
import {
    getOrderStatus,
    getRevenues,
    URL_API_STATISTICAL,
} from "@/services/StatisticalService";
import { useSearchParams } from "next/navigation";
import useAppNotifications from "@/hooks/useAppNotifications";
import { useEffect } from "react";

const StatisticalComponent = () => {
    const { showNotification } = useAppNotifications();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const { data: revuneData, error: revuneError, isLoading: revuneLoading, mutate: revuneMutate } = useSWR(
        `${URL_API_STATISTICAL.getRevenue}${params.size !== 0 ? `?${params.toString()}` : ""
        }`,
        getRevenues,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );
    useEffect(() => {
        if (revuneError) {
            showNotification("error", {
                message: revuneError?.message,
                description:
                    revuneError?.response?.data?.message || "Error fetching STATISTICAL",
            });
        }
    }, [revuneError]);

    const { data, error, isLoading, mutate } = useSWR(
        `${URL_API_STATISTICAL.getOrderStatus}${params.size !== 0 ? `?${params.toString()}` : ""
        }`,
        getOrderStatus,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );
    useEffect(() => {
        if (error) {
            showNotification("error", {
                message: error?.message,
                description:
                    error?.response?.data?.message || "Error fetching STATISTICAL",
            });
        }
    }, [error]);

    let resultRevune: any;
    let result: any;
    if (!revuneLoading && revuneData) {
        resultRevune = revuneData?.data;
    }
    if (!isLoading && data) {
        result = data?.data;
    }
    return (
        <div style={{ paddingBottom: 60 }}>
            <Title level={2} className="py-4 text-center">
                Thống kê
            </Title>
            <SalesStatistics />
            <div
                className=" flex bg-white rounded-lg p-3"
                style={{
                    width: "100%",
                    marginTop: 15,
                }}
            >
                <StatisticChart data={resultRevune} dataOrderStatus={result} />
            </div>
            <StatisticTables />
        </div>
    );
};

export default StatisticalComponent;
