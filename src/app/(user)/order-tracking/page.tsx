import { Metadata } from "next";
import UserLoader from "@/components/Loader/UserLoader";
import { Suspense } from "react";
import OrderTrackingComponent from "@/components/User/OrderTracking/OrderTrackingComponent";

export const metadata: Metadata = {
    title: "Theo dõi đơn hàng",
    description: "order tracking"
};

export default function OrderLookupPage() {
    return (
        <Suspense fallback={<UserLoader />}>
            <OrderTrackingComponent />
        </Suspense>
    );
};
