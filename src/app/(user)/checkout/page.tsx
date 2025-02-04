import {Metadata} from "next";
import {Suspense} from "react";
import UserLoader from "@/components/Loader/UserLoader";
import Checkout from "@/components/User/Checkout/Checkout";

export const metadata: Metadata = {
    title: "Thanh toán",
    description: "checkout"
};

export default function CheckoutPage() {
    return (
        <Suspense fallback={<UserLoader/>}>
            <Checkout/>
        </Suspense>
    );
}
