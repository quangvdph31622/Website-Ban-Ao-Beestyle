'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useOrder from '@/components/Admin/Order/hooks/useOrder';
import UserLoader from '@/components/Loader/UserLoader';
import { deleteAllCartItems, removeAllCartItems } from '@/services/user/ShoppingCartService';
import { getAccountInfo } from '@/utils/AppUtil';
import { getSendOrderTrackingNumber } from '@/services/MailService';

const VNPayConfirmPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handleCreateOrderOnline } = useOrder();
    const paymentStatus = searchParams.get('vnp_ResponseCode');
    const hasCalledApi = useRef(false);

    useEffect(() => {
        if (paymentStatus === '00' && !hasCalledApi.current) {
            const handlePaymentResult = async () => {
                hasCalledApi.current = true; // Tạo Flag checkpoint
                const combinedDataString = localStorage.getItem('pendingOrderData');
                if (combinedDataString) {
                    const pendingOrderData = JSON.parse(combinedDataString);
                    try {
                        const result = await handleCreateOrderOnline(pendingOrderData);
                        if (result.success === false) {
                            throw new Error(result.message);
                        }

                        const trackingNumber = result.orderTrackingNumber;
                        const sendMailData = {
                            orderTrackingNumber: trackingNumber,
                            recipient: pendingOrderData.email,
                            customerName: pendingOrderData.receiverName,
                        }

                        // Xoá data Cart
                        if (getAccountInfo()) {
                            deleteAllCartItems();
                        } else {
                            removeAllCartItems();
                        }

                        // Gửi mail đơn hàng về cho khách hàng
                        await getSendOrderTrackingNumber(sendMailData)
                        localStorage.removeItem('pendingOrderData');
                        router.push(`/order/success?orderTrackingNumber=${trackingNumber}`);
                    } catch (error) {
                        console.error("Lỗi khi tạo đơn hàng sau thanh toán:", error);
                        localStorage.removeItem('pendingOrderData');
                        router.push('/order/error');
                    }
                } else {
                    console.error("Không tìm thấy dữ liệu đơn hàng tạm thời.");
                    router.push('/order/error');
                }
            };
            handlePaymentResult();
        } else if (paymentStatus === '24') {
            localStorage.removeItem('pendingOrderData');
            router.push('/order/cancel');
        } else if (paymentStatus && paymentStatus !== '00') {
            localStorage.removeItem('pendingOrderData');
            router.push('/order/error');
        }
    }, [paymentStatus, router, handleCreateOrderOnline]);


    return (
        <div>
            <UserLoader />
        </div>
    );
};

export default VNPayConfirmPage;
