import AuthenticationOwnerComponent from "@/components/User/Account/AuthenticationOwnerComponent";
import {Metadata} from "next";
import {Suspense} from "react";
import UserLoader from "@/components/Loader/UserLoader";

export const metadata: Metadata = {
    title: "Đăng nhập",
    description: "login"
};

export default function LoginPage() {
    return (
        <Suspense fallback={<UserLoader/>}>
            <AuthenticationOwnerComponent/>
        </Suspense>
    )
}
