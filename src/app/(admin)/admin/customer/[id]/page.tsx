
import CustomerDetailComponent from "@/components/Admin/Customer/Detail/CustomerDetailComponent";
import AdminLoader from "@/components/Loader/AdminLoader";
import { Metadata } from "next";
import React, { Suspense } from "react";


export const metadata: Metadata = {
  title: "Khách hàng",
  description: "Customer detail service",
};


  function DeatailCustomer({ params }: { params: { id: string }}) {
    const customerId = params.id;
    return (
        <Suspense fallback={<AdminLoader/>}>
            <CustomerDetailComponent customerId={customerId}/>
        </Suspense>
    );
}

export default DeatailCustomer;
