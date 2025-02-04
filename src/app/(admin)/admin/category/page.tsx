import React, {Suspense} from "react";
import AdminLoader from "@/components/Loader/AdminLoader";
import {Metadata} from "next";
import CategoryComponent from "@/components/Admin/Category/CategoryComponent";

export const metadata: Metadata = {
    title: "Danh mục sản phẩm",
    description: "ShopProductGridComponent - Category service",
};

function Category() {
    return (
        <Suspense fallback={<AdminLoader/>}>
            <CategoryComponent/>
        </Suspense>
    );
}

export default Category;