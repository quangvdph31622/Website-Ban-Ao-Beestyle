import React, {Suspense} from "react";
import AdminLoader from "@/components/Loader/AdminLoader";
import {Metadata} from "next";
import OrderDetailComponent from "@/components/Admin/Order/Detail/OrderDetailComponent";

export const metadata: Metadata = {
    title: "Hoá đơn",
    description: "Order detail - Order service",
};
const OrderPage: React.FC = () => {
    return (
        <Suspense fallback={<AdminLoader/>}>
            <OrderDetailComponent/>
        </Suspense>
    );
};

export default OrderPage;
