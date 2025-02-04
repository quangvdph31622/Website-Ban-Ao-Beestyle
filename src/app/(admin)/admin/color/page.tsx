import AdminLoader from "@/components/Loader/AdminLoader";
import ColorComponent from "@/components/Admin/Color/ColorComponent";
import { Suspense } from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Màu Sắc",
    description: "ShopProductGridComponent - Color service",
};

function Color() {
    return (
        <Suspense fallback={<AdminLoader />}>
            <ColorComponent/>
        </Suspense>
    );
}
export default Color;