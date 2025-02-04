import React, {createContext, useContext, useState} from "react";

interface PaymentInfoType {
    totalQuantity: number; // tổng số lượng
    originalAmount: number;  // tổng số tiền trong giỏ
    discountAmount: number; // tiền giảm giá khi áp voucher
    shippingFee: number; // phí vận chuyển
    finalTotalAmount: number; // tổng tiền thanh toán sau khi tính giản giá, phí ship
    amountDue: number; // tiền khách cần trả
}

interface OrderDetailContextType {
    paymentInfo: PaymentInfoType;
    setPaymentInfo: React.Dispatch<React.SetStateAction<PaymentInfoType>>;
}

const OrderDetailContext = createContext<OrderDetailContextType | null>(null);

const OrderDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [paymentInfo, setPaymentInfo] = useState({
        totalQuantity: 0, // tổng số lượng
        originalAmount: 0,  // tổng số tiền trong giỏ
        discountAmount: 0, // tiền giảm giá khi áp voucher
        shippingFee: 0, // phí vận chuyển
        finalTotalAmount: 0, // tổng tiền thanh toán sau khi tính giản giá, phí ship
        amountDue: 0 // tiền khách cần trả
    });

    return (
        <OrderDetailContext.Provider value={{paymentInfo, setPaymentInfo}}>
            {children}
        </OrderDetailContext.Provider>
    );
}
export default OrderDetailProvider;

export const useOrderDetailContext = () => {
    return useContext(OrderDetailContext);
};