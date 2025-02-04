/* eslint-disable @next/next/no-img-element */
'use client';

import { Tabs, TabsProps, Flex, Typography, Layout } from 'antd';
import { useState } from 'react';
import LoginFormOwner from "@/components/User/Account/LoginFormOwner";
import RegisterFormOwner from "@/components/User/Account/RegisterFormOwner";
import RegisterForm from '@/components/User/Account/RegisterFormOwner';

const { Text } = Typography;
const { Content } = Layout;

const AuthenticationOwnerComponent = () => {
    const [tabAuthKey, setTabAuthKey] = useState<string>('login');

    const handleRegisterSuccess = () => {
        // Chuyển tab sang "Đăng nhập" khi đăng ký thành công
        setTabAuthKey('login');
    };

    const items: TabsProps['items'] = [
        {
            key: 'login',
            label: (
                <Text strong
                    style={{
                        color: tabAuthKey === 'login' ? '#F7941D' : '#000000',
                        fontSize: 20,
                        padding: 10
                    }}>
                    Đăng nhập
                </Text>
            ),
            children: <LoginFormOwner />,
        },
        {
            key: 'register',
            label: (
                <Text strong
                    style={{
                        color: tabAuthKey === 'register' ? '#F7941D' : '#000000',
                        fontSize: 20,
                        padding: 10
                    }}>
                    Đăng ký
                </Text>

            ),

            children: <RegisterForm handleRegisterSuccess={handleRegisterSuccess} />,

            // children: <RegisterFormOwner/>,
        },
    ];

    return (
        <>
            <Flex vertical align="center" style={{ width: '100%', padding: '100px 0' }}>
                <Flex justify="center" className='mb-4'>
                    <img src="/logo.png" alt="BEESTYLE" width={200} />
                </Flex>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Tabs
                        centered
                        activeKey={tabAuthKey}
                        onChange={(activeKey) => setTabAuthKey(activeKey)}
                        className="custom-tabs"
                        items={items}
                        style={{ width: "25%", minWidth: 400 }}
                    />
                </div>
            </Flex>
        </>
    );
};

export default AuthenticationOwnerComponent;
