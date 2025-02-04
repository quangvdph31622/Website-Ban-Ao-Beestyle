import React from 'react';
import { Typography, Space, Avatar } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ContactInfo = () => {
    return (
        <div className="max-w-md mx-auto py-4">
            <Title level={2} className="text-2xl font-bold mb-4">
                Thông tin liên hệ
            </Title>
            <Space direction="vertical" size="middle" className="w-full">
                <div className="flex items-start mb-4">
                    <Avatar
                        size={40}
                        className="flex items-center justify-center bg-gray-100 rounded-full mr-4 shrink-0"
                        icon={<EnvironmentOutlined style={{ color: '#333' }} />}
                    />
                    <div>
                        <Title level={5} className="font-bold">
                            Địa chỉ
                        </Title>
                        <Text>
                            Phương Canh, Nam Từ Liêm, Hà Nội
                        </Text>
                    </div>
                </div>
                <div className="flex items-start mb-4">
                    <Avatar
                        size={40}
                        className="flex items-center justify-center bg-gray-100 rounded-full mr-4 shrink-0"
                        icon={<PhoneOutlined style={{ color: '#333' }} />}
                    />
                    <div>
                        <Title level={5} className="font-bold">
                            Điện thoại
                        </Title>
                        <Text>0123.456.789</Text>
                    </div>
                </div>
                <div className="flex items-start mb-4">
                    <Avatar
                        size={40}
                        className="flex items-center justify-center bg-gray-100 rounded-full mr-4 shrink-0"
                        icon={<ClockCircleOutlined style={{ color: '#333' }} />}
                    />
                    <div>
                        <Title level={5} className="font-bold">
                            Thời gian làm việc
                        </Title>
                        <Text>
                            Thứ 2 đến thứ 6 : từ 8h30 đến 18h
                        </Text>
                    </div>
                </div>
                <div className="flex items-start mb-4">
                    <Avatar
                        size={40}
                        className="flex items-center justify-center bg-gray-100 rounded-full mr-4 shrink-0"
                        icon={<MailOutlined style={{ color: '#333' }} />}
                    />
                    <div>
                        <Title level={5} className="font-bold">
                            Email
                        </Title>
                        <Text>cskh@beestyle.vn</Text>
                    </div>
                </div>
            </Space>
        </div>
    );
};

export default ContactInfo;
