import ShopProductGridComponent from "@/components/User/ShopProductGrid/ShopProductGridComponent";
import {Metadata} from "next";
import UserLoader from "@/components/Loader/UserLoader";
import {Suspense} from "react";

export const metadata: Metadata = {
    title: "Sản phẩm",
    description: "product"
};

export default function Category() {
    return (
        <Suspense fallback={<UserLoader/>}>
            <ShopProductGridComponent/>
        </Suspense>
    );
};
