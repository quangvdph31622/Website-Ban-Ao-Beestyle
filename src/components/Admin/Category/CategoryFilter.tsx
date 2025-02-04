import {Checkbox, Col, Collapse, GetProp, Radio, RadioChangeEvent, Row, Space, Typography} from "antd";
import {STATUS} from "@/constants/Status";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import React, {memo, useEffect, useState} from "react";
import useCategory from "@/components/Admin/Category/hooks/useCategory";
import StatusFilter from "@/components/Filter/StatusFilter";

const {Title} = Typography;

const optionsLevelCategory = [
    {label: 'Cấp 1', value: 1},
    {label: 'Cấp 2', value: 2},
    {label: 'Cấp 3', value: 3},
]

interface IProps {
    error?: Error;
}

const CategoryFilter = (props: IProps) => {
    const {error} = props;
    const [isErrorNetWork, setErrorNetWork] = useState(false);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();

    useEffect(() => {
        if (error) setErrorNetWork(true);
        else setErrorNetWork(false);
    }, [error]);

    const onChangeStatus = (e: RadioChangeEvent) => {
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

    const onChangeLevel: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any[]) => {
        const params = new URLSearchParams(searchParams.toString());
        if (checkedValues.length > 0 && checkedValues.length < optionsLevelCategory.length) {
            console.log(checkedValues.toString());
            params.set("level", checkedValues.toString());
            params.set("page", "1");
        } else {
            params.delete("level");
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <Space direction="vertical" style={{minWidth: 256}}>
            <Collapse
                size="small" className="w-full bg-white" ghost expandIconPosition="end"
                style={{borderRadius: 8, boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)', maxWidth: 256}}
                items={[
                    {
                        key: 'level',
                        label: <Title level={5} style={{margin: '0px 10px'}}>Cấp danh mục</Title>,
                        children: (
                            <Checkbox.Group onChange={onChangeLevel} disabled={isErrorNetWork}>
                                <Row>
                                    {optionsLevelCategory.map((item) => (
                                        <Col key={item.value} span={24} style={{marginBottom: 10}}>
                                            <Checkbox value={item.value} style={{marginLeft: 10}}>
                                                {item.label}
                                            </Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        ),
                    },
                ]}
            />

            <StatusFilter
                onChange={onChangeStatus}
                disabled={isErrorNetWork}
            />
        </Space>
    );
};
export default memo(CategoryFilter);
