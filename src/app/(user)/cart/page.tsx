import React, {Suspense} from 'react';
import ShoppingCart from "@/components/User/Cart/ShoppingCart";
import {Metadata} from "next";
import UserLoader from "@/components/Loader/UserLoader";

export const metadata: Metadata = {
    title: "Giỏ hàng",
    description: "cart"
};

const CartPage = () => {
    return (
        <Suspense fallback={<UserLoader/>}>
            <ShoppingCart/>
        </Suspense>
    );
};

export default CartPage;
