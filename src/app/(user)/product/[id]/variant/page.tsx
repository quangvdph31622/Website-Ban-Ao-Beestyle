import React from "react";
import ProductSection from "@/components/User/ShopSingle/ProductSession";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Sản phẩm",
    description: "product"
};

export default function ProductDetail() {
    return (
        <ProductSection/>
    );
}
