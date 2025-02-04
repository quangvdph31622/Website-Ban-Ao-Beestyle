import { Breadcrumb, DatePicker, Flex, GetProps, Input, Space, Typography } from "antd";
import Search from "antd/es/input/Search";
import ColorButton from "@/components/Button/ColorButton";
import { HomeOutlined, PlusOutlined } from "@ant-design/icons";
import React, { memo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {findPromotionsByDate} from "../../../services/PromotionService";

type SearchProps = GetProps<typeof Input.Search>;
const { Title } = Typography;
const { RangePicker } = DatePicker;

interface IProps {
    setPromotion: (Promotion: any[]) => void;
}

const HeaderPromotion = (setPromotion: IProps) => {
    const [isFilterVisible, setIsFilterVisible] = useState(true);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const params = new URLSearchParams(searchParams);
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        if (info?.source === "input" && value) {
            params.set("name", value);
            params.set("page", "1");
            replace(`${pathname}?${params.toString()}`);
        } else {
            params.delete("name");
            replace(`${pathname}?${params.toString()}`);
        }
    };

    let breadcrumbTitle;
    if (pathname === '/admin/promotion/create') {
        breadcrumbTitle = 'Thêm mới khuyến mại';
    } else if (pathname === '/admin/promotion/update') {
        breadcrumbTitle = 'Cập nhật khuyến mại';
    } else {
        breadcrumbTitle = 'Khuyến mại';
    }

    const handleDateChange = (dates: any, dateStrings: [string, string]) => {
        if (dates && dateStrings[0] && dateStrings[1]) {
            params.set("startDate", dateStrings[0]);
            params.set("endDate", dateStrings[1]);

            if (!params.has("page")) {
                params.set("page", "1");
            }
        } else {
            params.delete("startDate");
            params.delete("endDate");
        }

        replace(`${pathname}?${params.toString()}`);
    };
    return (
        <>
            <Breadcrumb
                style={{ marginBottom: '10px' }}
                items={[
                    { title: <Link href="/admin"><HomeOutlined /></Link> },
                    { title: breadcrumbTitle },
                ]}
            />

            <Flex align={"flex-start"} justify={"flex-start"} gap={"small"}>
                <Title level={3} style={{ margin: '0px 0px 20px 10px', minWidth: 256, flexGrow: 1 }}>Khuyến mại</Title>
                <div className="w-full">
                    <Flex justify={'space-between'} align={'center'}>
                        <div className="flex-grow max-w-xs">
                            <Search
                                placeholder="Theo tên voucher"
                                allowClear
                                onSearch={onSearch}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="flex-grow max-w-xs">
                            <RangePicker
                                onChange={handleDateChange}
                                placeholder={['Từ ngày', 'Đến ngày']}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <Space>
                                <Link href="/admin/promotion/create" passHref>
                                    <ColorButton
                                        bgColor="#00b96b"
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        style={{ display: 'inline-flex', alignItems: 'center' }}
                                    >
                                        Thêm khuyến mại
                                    </ColorButton>
                                </Link>
                            </Space>
                        </div>
                    </Flex>
                </div>
            </Flex>
        </>
    );
};

export default memo(HeaderPromotion);
