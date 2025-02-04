"use client"
import {Breadcrumb, Flex, GetProps, Input, Typography} from "antd";
import Search from "antd/es/input/Search";
import React, {memo} from "react";
import {HomeOutlined} from "@ant-design/icons";
import {ParamFilterOrder} from "@/components/Admin/Order/hooks/useFilterOrder";

type SearchProps = GetProps<typeof Input.Search>;
const {Title} = Typography;

interface IProps {
    setFilterParam: React.Dispatch<React.SetStateAction<ParamFilterOrder>>;
}

const HeaderOrder: React.FC<IProps> = (props) => {
    const {setFilterParam} = props;

    const onSearch: SearchProps['onSearch'] =
        (value, _e, info) => {
            if (info?.source === "input" && value) {
                setFilterParam((prevValue: ParamFilterOrder) => {
                    return {
                        ...prevValue,
                        page: 1,
                        keyword: value
                    }
                });
            } else {
                setFilterParam((prevValue) => ({...prevValue, keyword: undefined}));
            }
        }

    return (
        <>
            <Breadcrumb
                items={[
                    {href: '/admin', title: <HomeOutlined/>,},
                    {title: 'Hóa đơn',},
                ]}
            />
            <Flex align={"flex-start"} justify={"flex-start"} gap={"small"} style={{margin: '10px 0px'}}>
                <Title level={3} style={{marginLeft: 10, minWidth: 256, flexGrow: 1}}>Hoá đơn</Title>
                <div className="w-full">
                    <Flex justify={'space-between'} align={'center'}>
                        <div className="flex-grow max-w-md">
                            <Search
                                placeholder="Tìm kiếm theo mã hóa đơn, tên, số điện thoại khách hàng"
                                allowClear
                                onSearch={onSearch}
                                style={{width: '100%'}}
                            />
                        </div>
                        {/*<div>*/}
                        {/*    <Space>*/}
                        {/*        <ColorButton*/}
                        {/*            bgColor="#00b96b"*/}
                        {/*            type="primary"*/}
                        {/*            icon={<PlusOutlined/>}*/}
                        {/*        >*/}
                        {/*            Tạo đơn hàng*/}
                        {/*        </ColorButton>*/}
                        {/*    </Space>*/}
                        {/*</div>*/}
                    </Flex>
                </div>
            </Flex>
        </>
    );
}

export default memo(HeaderOrder);