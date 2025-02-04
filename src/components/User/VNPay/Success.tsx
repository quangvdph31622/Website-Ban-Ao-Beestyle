'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Result } from 'antd';
import { getAccountInfo } from '@/utils/AppUtil';

const SuccessPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderTrackingNumber = searchParams.get('orderTrackingNumber');

    const handleViewOrder = () => {
        // Redirect đến trang quản lý đơn hàng
        if (getAccountInfo()) {
            router.push('/user-profile');
        } else {
            router.push(`/order-tracking`);
        }
    };

    return (
        <>
            <div className='my-[150px]'>
                <Result
                    status="success"
                    title="Giao dịch thành công"
                    subTitle={
                        <div>
                            <p>Mã đơn hàng: {orderTrackingNumber}</p>
                            Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được ghi nhận.
                        </div>
                    }
                    extra={
                        <Button type="primary" onClick={handleViewOrder}>
                            Xem đơn hàng
                        </Button>
                    }
                />
            </div>
        </>
    );
};

export default SuccessPage;
