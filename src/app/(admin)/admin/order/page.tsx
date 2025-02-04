import React, {Suspense} from "react";
import AdminLoader from "@/components/Loader/AdminLoader";
import {Metadata} from "next";
import OrderComponent from "@/components/Admin/Order/OrderComponent";

export const metadata: Metadata = {
    title: "Hoá đơn",
    description: "Order - Order service",
};
const OrderPage: React.FC = () => {
    return (
        <Suspense fallback={<AdminLoader/>}>
            <OrderComponent/>
        </Suspense>
    );
};

export default OrderPage;
