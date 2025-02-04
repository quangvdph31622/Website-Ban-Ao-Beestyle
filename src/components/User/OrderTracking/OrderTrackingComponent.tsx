'use client';

import React from 'react';
import { Layout, Typography, Button, Input, Divider, Form } from 'antd';
import BreadcrumbSection from '@/components/Breadcrumb/BreadCrumb';
import Paragraph from 'antd/es/typography/Paragraph';
import Image from 'next/image';
import { useAuthentication } from "@/components/Context/AuthenticationProvider";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";


const { Content } = Layout;
const { Title, Text } = Typography;

const breadcrumbItems = [
    { title: 'Trang chủ', path: '/' },
    { title: 'Tra cứu đơn hàng' },
];

const OrderTrackingComponent: React.FC = () => {
    const authentication = useAuthentication();
    const [form] = Form.useForm();
    const router = useRouter();

    const onFinish = () => {
        router.push('/order-tracking/' + form.getFieldValue('orderTrackingNumber'));
    }

    return (
        authentication?.authentication
            ? <></>
            : (
                <>
                    <BreadcrumbSection items={breadcrumbItems} />
                    <Layout className='pb-4'>
                        <Content className="p-4 sm:p-6 lg:p-8">
                            <Title level={2} className="ps-5 bg-white rounded-lg text-center py-3">
                                Tra cứu đơn hàng
                            </Title>
                            <div className='w-full p-5 bg-white rounded-lg flex justify-center items-center'>
                                <div className='me-5 w-[50vh]'>
                                    <Title level={4}>Mã đơn hàng</Title>
                                    <Paragraph className='text-gray-6 mb-3'>
                                        (Nhập vào mã đơn hàng của bạn)
                                    </Paragraph>
                                    <Form
                                        layout="horizontal"
                                        name="orderTracking"
                                        form={form}
                                        onFinish={onFinish}
                                    >
                                        <Form.Item
                                            name="orderTrackingNumber"
                                            className="mt-2"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập mã đơn hàng!",
                                                },
                                            ]}>
                                            <Input
                                                placeholder="VD: 12345678"
                                                maxLength={20}
                                                size='large'
                                                className='p-3'
                                            />
                                        </Form.Item>
                                        <Button
                                            type='default'
                                            className='bg-orange-500 text-white hover:!bg-orange-400 fs-6 border-none w-full mt-4'
                                            style={{ padding: '20px 0' }}
                                            htmlType='submit'
                                        >
                                            Tra cứu
                                        </Button>
                                    </Form>
                                </div>
                                <div className='ms-5'>
                                    <Image
                                        width={350}
                                        height={350}
                                        src={'/ship_supported.png'}
                                        alt='IMG'
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </Content>
                    </Layout>
                </>
            )

    )
};

export default OrderTrackingComponent;
