import { Suspense } from "react";
import AdminLoader from "@/components/Loader/AdminLoader";
import { Metadata } from "next";
import PromotionComponent from "@/components/Admin/Promotion/PromotionComponent";


export const metadata: Metadata = {
    title: "Chương trình khuyến mại",
    description: "Promotion"
}

const VoucherPage = () => {
    return (
        <Suspense fallback={<AdminLoader />}>
            <PromotionComponent/>
        </Suspense>
    );
}

export default VoucherPage;
