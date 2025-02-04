import { Suspense } from "react";
// <<<<<<< HEAD

// import TableCustomer from "@/components/Admin/Customer/CustomerComponent";
// import Loader from "@/components/Loader/Loader";
// =======
// import TableCustomer from "@/components/Admin/Customer/TableCustomer";
// import AdminLoader from "@/components/Loader/AdminLoader";
// >>>>>>> f06679210782d4a1c25b268270229a5e79d44ad9
import { Metadata } from "next";
import CustomerComponent from "@/components/Admin/Customer/CustomerComponent";
import AdminLoader from "@/components/Loader/AdminLoader";

export const metadata: Metadata = {
  title: "Khách hàng",
  description: "Customer - Customer service",
};

const CustomerPage = () => {
  return (
      <Suspense fallback={<AdminLoader />}>
        <CustomerComponent />
      </Suspense>
  );
};
export default CustomerPage;
