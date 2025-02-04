import React, {Suspense} from "react";
import AdminLoader from "@/components/Loader/AdminLoader";
import {Metadata} from "next";
import SizeComponent from "@/components/Admin/Size/SizeComponent";

export const metadata: Metadata = {
    title: "Kích thước",
    description: "ShopProductGridComponent - Size service",
};

function Size() {
    return (
        <Suspense fallback={<AdminLoader />}>
            <SizeComponent/>
        </Suspense>
    );
}

export default Size;