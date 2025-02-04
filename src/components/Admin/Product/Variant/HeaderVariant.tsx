"use client"
import React, {memo} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Breadcrumb, Flex, GetProps, Input, Space, Typography} from "antd";
import Search from "antd/es/input/Search";
import ColorButton from "@/components/Button/ColorButton";
import {HomeOutlined, PlusOutlined} from "@ant-design/icons";
import Link from "next/link";

type SearchProps = GetProps<typeof Input.Search>;
const {Title} = Typography;

interface IProps {
    setIsCreateModalOpen: (value: boolean) => void;
}

const HeaderFilter: React.FC<IProps> = (props) => {
    const {setIsCreateModalOpen} = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();

    const params = new URLSearchParams(searchParams);
    const onSearch: SearchProps['onSearch'] =
        (value, _e, info) => {
            if (info?.source === "input" && value) {
                params.set("keyword", value);
                params.set("page", "1");
                replace(`${pathname}?${params.toString()}`);
            } else {
                params.delete("keyword")
                replace(`${pathname}?${params.toString()}`);
            }
        }

    return (
        <>
            <Breadcrumb
                items={[
                    {title: <Link href={"/admin"}><HomeOutlined/></Link>,},
                    {title: <Link href={"/admin/product"}>Sản phẩm</Link>,},
                    {title: 'Chi tiết',},
                ]}
            />
            <Flex align={"flex-start"} justify={"flex-start"} gap={"small"} style={{margin: '10px 0px'}}>
                <Title level={3} style={{marginLeft: 10, minWidth: 256, flexGrow: 1}}>Sản phẩm chi tiết</Title>
                <div className="w-full">
                    <Flex justify={'space-between'} align={'center'}>
                        <div className="flex-grow max-w-96">
                            <Search
                                placeholder="Theo mã hàng hóa"
                                allowClear
                                onSearch={onSearch}
                                style={{width: '100%'}}
                            />
                        </div>
                        <div>
                            <Space>
                                <ColorButton
                                    bgColor="#00b96b"
                                    type="primary"
                                    icon={<PlusOutlined/>}
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    Thêm biến thể
                                </ColorButton>
                            </Space>
                        </div>
                    </Flex>
                </div>
            </Flex>
        </>
    );
}
export default memo(HeaderFilter);