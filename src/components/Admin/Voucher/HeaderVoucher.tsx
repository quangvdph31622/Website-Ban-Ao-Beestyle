import { Flex, Input, Typography, DatePicker, Space } from "antd";
import Search from "antd/es/input/Search";
import ColorButton from "@/components/Button/ColorButton";
import { PlusOutlined } from "@ant-design/icons";
import { memo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { findVouchersByDate } from "@/services/VoucherService";
import { SearchProps } from "antd/lib/input";

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface IProps {
    setIsCreateModalOpen: (value: boolean) => void;
    setVouchers: (vouchers: any[]) => void;
}

const HeaderVoucher = ({ setIsCreateModalOpen, setVouchers }: IProps) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const params = new URLSearchParams(searchParams);

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        if ((info?.source === "input" || info?.source === "button") && value) {
            params.set("name", value);
            if (!params.has("page")) {
                params.set("page", "1");
            }
            replace(`${pathname}?${params.toString()}`);
        } else {
            params.delete("name");
            replace(`${pathname}?${params.toString()}`);
        }
    };

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
        <Flex align={"flex-start"} justify={"flex-start"} gap={"small"}>
            <Title level={3} style={{ margin: '0 0 20px 10px', minWidth: 256, flexGrow: 1 }}>
                Phiếu giảm giá
            </Title>
            <div className="w-full">
                <Flex justify={'space-between'} align={'center'}>
                    <div style={{ flex: '1', maxWidth: '300px' }}>
                        <Search
                            placeholder="Theo tên voucher"
                            allowClear
                            onSearch={onSearch}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ flex: '1', maxWidth: '300px', marginRight: '10px' }}>
                        <RangePicker
                            onChange={handleDateChange}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div>
                        <Space>
                            <ColorButton
                                bgColor="#00b96b"
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Thêm phiếu giảm giá
                            </ColorButton>
                        </Space>
                    </div>
                </Flex>
            </div>
        </Flex>
    );
};

export default memo(HeaderVoucher);
