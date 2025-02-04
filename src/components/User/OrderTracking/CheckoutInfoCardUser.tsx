import React, {memo, useEffect, useState} from "react";
import {Card, Flex, Typography} from "antd";
import {FORMAT_NUMBER_WITH_COMMAS} from "@/constants/AppConstants";
import {IOrderItem} from "@/types/IOrderItem";
import {IOrderDetail} from "@/types/IOrder";
import {
    calculateCartOriginAmount, calculateCartTotalQuantity, calculateFinalAmount,
    calculateInvoiceDiscount, calculateShippingFee
} from "@/utils/AppUtil";
import {ORDER_TYPE} from "@/constants/OrderType";
import useAppNotifications from "@/hooks/useAppNotifications";
import {ORDER_STATUS} from "@/constants/OrderStatus";
import {useOrderDetailContext} from "@/components/Admin/Order/Detail/Context/OrderDetailProvider";

const {Text} = Typography;

interface IProps {
    orderDetail: IOrderDetail,
    dataCart: IOrderItem[];
}

const CheckoutInfoCardUser: React.FC<IProps> = (props) => {
    const {showNotification} = useAppNotifications();
    const {orderDetail, dataCart} = props
    const [paymentInfo, setPaymentInfo] = useState({
        totalQuantity: 0, // tổng số lượng
        originalAmount: 0,  // tổng số tiền trong giỏ
        discountAmount: 0, // tiền giảm giá khi áp voucher
        shippingFee: 0, // phí vận chuyển
        finalTotalAmount: 0, // tổng tiền thanh toán sau khi tính giản giá, phí ship
        amountDue: 0 // tiền khách cần trả
    });

    /**
     * Cập nhật thông tin thanh tóán của đơn hàng
     */
    const updatePaymentInfo = async () => {
        // tính tổng số lượng trong giỏ
        const totalQuantity: number = calculateCartTotalQuantity(dataCart);

        // tính tổng tiền hàng trong giỏ
        const originalAmount: number = calculateCartOriginAmount(dataCart);

        // tính tiền giảm giá cho đơn hàng khi áp dụng voucher
        const discountAmount: number = calculateInvoiceDiscount(orderDetail?.voucherInfo, originalAmount);
        console.log(discountAmount)

        // Tính phí vận chuyển
        let shippingFee = 0;
        if (orderDetail?.orderType === ORDER_TYPE.DELIVERY.key &&
            orderDetail?.orderStatus === ORDER_STATUS.AWAITING_CONFIRMATION.key) {
            try {
                shippingFee = await calculateShippingFee(originalAmount, orderDetail?.shippingAddress);
            } catch (error: any) {
                showNotification("error", {message: error.message});
            }
        } else {
            shippingFee = orderDetail?.shippingFee ?? 0;
        }

        // tính tổng giá trị khách hàng cần trả
        const finalTotalAmount: number = calculateFinalAmount(originalAmount, discountAmount, shippingFee);


        // tính tiền khách cần trả
        const amountDue: number = finalTotalAmount;

        // Cập nhật state `paymentInfo`
        setPaymentInfo({
            totalQuantity,
            originalAmount,
            discountAmount,
            shippingFee,
            finalTotalAmount,
            amountDue
        });
    }

    useEffect(() => {
        const runUpdatePaymentInfo = async () => {
            await updatePaymentInfo();
        };
        runUpdatePaymentInfo();
    }, [dataCart, orderDetail]);

    return (
        <Card title="Thông tin thanh toán" style={{width: "100%"}}>
            <Flex justify="end">
                <Flex align="center" style={{width: "100%"}} wrap gap={10}>
                    <Flex justify="space-between" align="center"
                          style={{width: "100%", paddingBottom: 4}} wrap>
                        <Text style={{fontSize: 16}}>
                            <span style={{marginInlineEnd: 30}}>Tổng số lượng</span>
                        </Text>

                        <Text style={{fontSize: 16, marginInlineEnd: 10}} strong>
                            {`${paymentInfo?.totalQuantity}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                        </Text>
                    </Flex>

                    <Flex justify="space-between" align="center"
                          style={{width: "100%", paddingBottom: 4}} wrap>
                        <Text style={{fontSize: 16}}>
                            <span style={{marginInlineEnd: 30}}>Tổng tiền hàng</span>
                        </Text>

                        <Text style={{fontSize: 16, marginInlineEnd: 10}} strong>
                            {`${paymentInfo?.originalAmount}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                        </Text>
                    </Flex>

                    <Flex justify="space-between" align="center"
                          style={{width: "100%", paddingBottom: 4}} wrap>
                        <Text style={{fontSize: 16}}>
                            <span style={{marginInlineEnd: 30}}>Giảm giá</span>
                        </Text>

                        <Text style={{fontSize: 16, marginInlineEnd: 10}} strong>
                            {`${paymentInfo?.discountAmount}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                        </Text>
                    </Flex>

                    <Flex justify="space-between" align="center"
                          style={{width: "100%", paddingBottom: 4}} wrap>
                        <Text style={{fontSize: 16}}>
                            <span style={{marginInlineEnd: 30}}>Phí vận chuyển</span>
                        </Text>

                        <Text style={{fontSize: 16, marginInlineEnd: 10}} strong>
                            {
                                `${orderDetail?.orderStatus === ORDER_STATUS.AWAITING_CONFIRMATION.key
                                    ? paymentInfo?.shippingFee
                                    : orderDetail?.shippingFee}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')
                            }
                        </Text>
                    </Flex>

                    <Flex justify="space-between" align="center"
                          style={{width: "100%", paddingBottom: 4}} wrap>
                        <Text style={{fontSize: 16}}>
                            <span style={{marginInlineEnd: 30}}>Tổng thanh toán</span>
                        </Text>

                        <Text style={{fontSize: 16, marginInlineEnd: 10}} strong>
                            {`${paymentInfo?.finalTotalAmount}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    )
}
export default memo(CheckoutInfoCardUser);