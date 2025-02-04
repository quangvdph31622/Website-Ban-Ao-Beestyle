import MaterialComponent from "@/components/Admin/Material/MaterialComponent";
import { Suspense } from "react";
import AdminLoader from "@/components/Loader/AdminLoader";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Chất liệu",
    description: "ShopProductGridComponent - Material service",
};

const MaterialPage = () => {
    return (
        <Suspense fallback={<AdminLoader />}>
            <MaterialComponent/>
        </Suspense>
    );
}
export default MaterialPage;