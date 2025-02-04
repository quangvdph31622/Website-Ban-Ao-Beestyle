import { Suspense } from "react";
import AdminLoader from "@/components/Loader/AdminLoader";
import { Metadata } from "next";
import VariantComponent from "@/components/Admin/Product/Variant/VariantComponent";


export const metadata: Metadata = {
    title: "Sản phẩm",
    description: "ShopProductGridComponent variant service",
};

function Variant({ params }: { params: { id: string } }) {
    const { id } = params;
    return (
        <Suspense fallback={<AdminLoader />}>
            <VariantComponent productId={id} />
        </Suspense>
    );
}

export default Variant;
