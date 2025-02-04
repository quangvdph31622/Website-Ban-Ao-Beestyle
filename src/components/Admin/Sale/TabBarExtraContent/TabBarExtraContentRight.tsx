"use client"
import React, { memo, useState } from "react";
import { AutoComplete, AutoCompleteProps, Button, Dropdown, Flex, MenuProps, Space, Typography } from "antd";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import CheckoutComponent from "@/components/Admin/Sale/CheckoutComponent";
import { ControlOutlined, LoginOutlined, MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { getAdminAccountInfo } from "@/utils/AppUtil";

const { Title } = Typography;

const items: MenuProps['items'] = [
    {
        key: 'quan-ly',
        label: (
            <Link
                href={getAdminAccountInfo() && getAdminAccountInfo().role === 'ADMIN' ? "/admin" : "/admin/order"}
            >
                Quản lý
            </Link>
        ),
        icon: <ControlOutlined />
    },
    {
        key: 'logout',
        label: 'Đăng xuất',
        icon: <LoginOutlined />,
        onClick: () => {
            localStorage.removeItem('authenticationAdmin');
            localStorage.setItem('loggedOut', Date.now().toString());
            window.location.href = '/admin-account';
        },
    },
];

const TabBarExtraContentRight: React.FC = () => {
    return (
        <Flex style={{ margin: "0px 10px 0px 10px" }} gap={10} align="center">
            <Title level={5} style={{ margin: 0 }}>{getAdminAccountInfo() && getAdminAccountInfo()?.fullName}</Title>
            <Dropdown menu={{ items }} trigger={['click']}>
                <Button style={{ border: "none" }}>
                    <MenuOutlined />
                </Button>
            </Dropdown>
        </Flex>
    )
};
export default memo(TabBarExtraContentRight);
