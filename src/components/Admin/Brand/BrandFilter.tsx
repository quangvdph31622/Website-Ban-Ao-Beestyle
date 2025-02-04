import {RadioChangeEvent, Row, Space, Typography} from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {memo, useEffect, useState} from "react";
import StatusFilter from "@/components/Filter/StatusFilter";

interface IProps {
    error?: Error;
}

const BrandFilter = (props: IProps) => {
    const [isErrorNetWork, setErrorNetWork] = useState(false);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const { error } = props;

    useEffect(() => {
        if (error) setErrorNetWork(true);
        else setErrorNetWork(false);
    }, [error]);

    const onChange = (e: RadioChangeEvent) => {
        const params = new URLSearchParams(searchParams);
        const value = e.target.value;
        if (value) {
            params.set("status", value);
            params.set("page", "1");
        } else {
            params.delete("status");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Space direction="vertical" style={{ minWidth: 256 }}>
            <StatusFilter
                onChange={onChange}
                disabled={isErrorNetWork}
            />
        </Space>
    );
};
export default memo(BrandFilter);
