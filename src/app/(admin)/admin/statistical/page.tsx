import { Suspense } from "react";

import { Metadata } from "next";
import StaffComponent from "@/components/Admin/Statistical/StaffComponent";
import AdminLoader from "@/components/Loader/AdminLoader";

export const metadata: Metadata = {
    title: "Thống kê",
    description: "Staff - Staff service",
};

const StatisticalPage = () => {
    return (
        <Suspense fallback={<AdminLoader />}>
            <StatisticalComponent />
        </Suspense>
    );
};
export default StatisticalPage;
