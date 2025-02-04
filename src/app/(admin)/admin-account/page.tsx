import {Metadata} from "next";
import {Suspense} from "react";
import AuthenticationAdminComponent from "@/components/Admin/Account/AuthenticationAdminComponent";
import AdminLoader from "@/components/Loader/AdminLoader";

export const metadata: Metadata = {
    title: "Đăng nhập - quản lý",
    description: "login"
};

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<AdminLoader/>}>
            <AuthenticationAdminComponent/>
        </Suspense>
    )
}
