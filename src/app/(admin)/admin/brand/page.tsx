import BrandComponent from "@/components/Admin/Brand/BrandComponent";
import AdminLoader from "@/components/Loader/AdminLoader";
import React, { Suspense } from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Thương hiệu",
    description: "ShopProductGridComponent - Brand service",
};

function BrandPage() {
    return (
        <Suspense fallback={<AdminLoader />}>
            <BrandComponent/>
        </Suspense>
    );
}
export default BrandPage;