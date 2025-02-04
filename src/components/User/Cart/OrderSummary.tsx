import React from 'react';
import { Alert, Card, Divider, Typography } from "antd";
import Link from "next/link";
import { calculateUserCartTotalAmount } from '@/utils/AppUtil';

const { Title } = Typography;

const OrderSummary = ({ cartItems }: any) => {

    const { Text } = Typography;

    const totalAmount = calculateUserCartTotalAmount(cartItems);

    return (
        <>
            <Card
                className="max-w-md mx-auto shadow-md border"
                bordered={false}
            >
                <Title level={4} className="font-bold mb-4">
                    Thông tin đơn hàng
                </Title>

                <Divider className="my-2 bg-gray-3" />

                <div className="flex justify-between items-center my-4">
                    <Text className="text-lg font-medium">Tổng tiền:</Text>
                    <Text className="text-red-500 text-xl font-bold">
                        {totalAmount.toLocaleString()} đ
                    </Text>
                </div>

                <Divider className="my-2 mb-3 bg-gray-3" />

                <div className="text-gray-500 mb-6">
                    <ul className="list-disc list-inside space-y-1 text-green-600">
                        <li>* Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
                        <li>* Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</li>
                    </ul>
                </div>

                <Link
                    href={"/checkout"}
                    className="btn text-black w-full py-2 text-lg font-medium hover:!bg-black hover:!text-white"
                    style={{ backgroundColor: "#FCAF17" }}
                >
                    Thanh toán
                </Link>
            </Card>
            <Alert
                message={(<strong className='fw-semibold'>Chính sách mua hàng:</strong>)}
                description={(
                    <>
                        <p className='text-black mb-2'>- Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị tối thiểu 0₫ trở lên.</p>
                        <span>- Mã giảm giá chỉ được áp dụng đối với khách hàng đã đăng ký tài khoản.</span>
                    </>
                )}
                type="info"
                className="my-3"
            />
        </>
    );
};

export default OrderSummary;
