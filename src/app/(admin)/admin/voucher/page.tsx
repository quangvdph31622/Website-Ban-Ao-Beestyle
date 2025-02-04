import VoucherComponent from "@/components/Admin/Voucher/VoucherComponent";
import { Suspense } from "react";
import AdminLoader from "@/components/Loader/AdminLoader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Phiếu giảm giá",
    description: "Voucher service"
}

const VoucherPage = () => {
    return (
        <Suspense fallback={<AdminLoader />}>
            <VoucherComponent/>
        </Suspense>
    );
}

export default VoucherPage;
