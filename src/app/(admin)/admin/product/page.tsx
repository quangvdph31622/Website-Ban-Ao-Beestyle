import {Suspense} from "react";
import AdminLoader from "@/components/Loader/AdminLoader";
import ProductComponent from "@/components/Admin/Product/ProductComponent";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Sản phẩm",
    description: "ShopProductGridComponent service",
};

const Product = () => {
    return (
        <Suspense fallback={<AdminLoader />}>
            <ProductComponent/>
        </Suspense>
    );
}

export default Product;