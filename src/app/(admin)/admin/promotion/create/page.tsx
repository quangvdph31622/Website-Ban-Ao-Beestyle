import { Suspense } from "react";
import AdminLoader from "@/components/Loader/AdminLoader";
import { Metadata } from "next";
import CreatePromotion from "../../../../../components/Admin/Promotion/CreatePromotion";

export const metadata: Metadata = {
    title: "Thêm đợt giảm giá",
    description: "Promotion service"
}

const CreatePromotionPage = () => {
    return (
        <Suspense fallback={<AdminLoader />}>
            <CreatePromotion/>
        </Suspense>
    );
}

export default CreatePromotionPage;
