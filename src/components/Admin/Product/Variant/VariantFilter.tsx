"use client"
import React, {useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Checkbox, Col, Collapse, GetProp, Radio, RadioChangeEvent, Row, Space, Typography} from "antd";
import {STATUS_PRODUCT} from "@/constants/StatusProduct";
import useOptionColor from "@/components/Admin/Color/hooks/useOptionColor";
import useOptionSize from "@/components/Admin/Size/hooks/useOptionSize";

const {Title} = Typography;

interface IProps {
    error?: Error;
    mutate: any;
}

const VariantFilter: React.FC<IProps> = (props) => {
    const {error, mutate} = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();
    const params = new URLSearchParams(searchParams);

    const {dataOptionColor, error : errorDataOptionColor, isLoading: isLoadingDataOptionColor}
        = useOptionColor(error ? false : true);
    const {dataOptionSize, error : errorDataOptionSize, isLoading: isLoadingDataOptionSize}
        = useOptionSize(error ? false : true);

    const [isErrorNetWork, setErrorNetWork] = useState(false);

    useEffect(() => {
        if (error) setErrorNetWork(true);
        else setErrorNetWork(false);
    }, [error]);

    const onChangeColorFilter: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        if (checkedValues.length > 0 && checkedValues.length < dataOptionColor.length) {
            params.set("colorIds", checkedValues.toString());
            params.set("page", "1");
        } else {
            params.delete("colorIds");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const onChangeSizeFilter: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        if (checkedValues.length > 0 && checkedValues.length < dataOptionColor.length) {
            params.set("sizeIds", checkedValues.toString());
            params.set("page", "1");
        } else {
            params.delete("sizeIds");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const onChangeStatusFilter = (e: RadioChangeEvent) => {
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
        <Space direction="vertical" style={{minWidth: 256}}>
            <Collapse
                size="small" className="w-full bg-white" ghost expandIconPosition="end" collapsible="icon"
                style={{borderRadius: 8, boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)', maxWidth: 256,}}
                items={[
                    {
                        key: 'color',
                        label: <Title level={5} style={{margin: '0px 10px'}}>Màu sắc</Title>,
                        children: (
                            <div style={{maxHeight: 400, overflow: "auto"}}>
                                <Checkbox.Group onChange={onChangeColorFilter}
                                                disabled={isErrorNetWork || errorDataOptionColor}
                                >
                                    <Row>
                                        {dataOptionColor.map((item: any) => (
                                            <Col key={item.key} span={24} style={{marginBottom: 10}}>
                                                <Checkbox value={item.value} style={{marginLeft: 10}}>
                                                    {item.label}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        ),
                    },
                ]}
            />
            <Collapse
                size="small" className="w-full bg-white" ghost expandIconPosition="end" collapsible="icon"
                style={{borderRadius: 8, boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)', maxWidth: 256,}}
                items={[
                    {
                        key: 'size',
                        label: <Title level={5} style={{margin: '0px 10px'}}>Kích cỡ</Title>,
                        children: (
                            <div style={{maxHeight: 400, overflow: "auto"}}>
                                <Checkbox.Group onChange={onChangeSizeFilter}
                                                disabled={isErrorNetWork || errorDataOptionSize}
                                >
                                    <Row>
                                        {dataOptionSize.map((item: any) => (
                                            <Col key={item.key} span={24} style={{marginBottom: 10}}>
                                                <Checkbox value={item.value} style={{marginLeft: 10}}>
                                                    {item.label}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        ),
                    },
                ]}
            />
            <Collapse
                size="small" className="w-full bg-white" ghost expandIconPosition="end" collapsible="icon"
                style={{borderRadius: 8, boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)', maxWidth: 256}}
                items={[
                    {
                        key: 'status-product-variant',
                        label: <Title level={5} style={{margin: '0px 10px'}}>Trạng thái</Title>,
                        children: (
                            <div style={{maxHeight: 400, overflow: "auto"}}>
                                <Radio.Group onChange={onChangeStatusFilter} disabled={isErrorNetWork}>
                                    <Row>
                                        <Col key={"ALL"} span={24} style={{marginBottom: 10}}>
                                            <Radio value={undefined} style={{marginLeft: 10}}>Tất cả</Radio>
                                        </Col>
                                        {Object.keys(STATUS_PRODUCT).map((key) => (
                                            <Col key={key} span={24} style={{marginBottom: 10}}>
                                                <Radio value={key} style={{marginLeft: 10}}>
                                                    {STATUS_PRODUCT[key as keyof typeof STATUS_PRODUCT]}
                                                </Radio>
                                            </Col>
                                        ))}
                                    </Row>
                                </Radio.Group>
                            </div>
                        ),
                    },
                ]}
            />
        </Space>

    );
}
export default VariantFilter;