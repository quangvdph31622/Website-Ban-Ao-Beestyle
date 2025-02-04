import { Suspense } from "react";

import { Metadata } from "next";
import StaffComponent from "@/components/Admin/Staff/StaffComponent";
import AdminLoader from "@/components/Loader/AdminLoader";

export const metadata: Metadata = {
  title: "Nhân viên",
  description: "Staff - Staff service",
};

const StaffPage = () => {
  return (
      <Suspense fallback={<AdminLoader />}>
        <StaffComponent />
      </Suspense>
  );
};
export default StaffPage;
