import {Suspense} from "react";
import AdminLoader from "@/components/Loader/AdminLoader";
import {Metadata} from "next";
import VariantComponent from "@/components/Admin/Product/Variant/VariantComponent";
import UpdatePromotion from "../../../../../../components/Admin/Promotion/UpdatePromotion";

export const metadata: Metadata = {
    title: "Cập nhật đợt giảm giá",
    description: "",
};

function UpdatePromotionPage() {
    return (
        <Suspense fallback={<AdminLoader/>}>
            <UpdatePromotion/>
        </Suspense>
    );
}

export default UpdatePromotionPage;