import { Metadata } from "next";
import UserLoader from "@/components/Loader/UserLoader";
import { Suspense } from "react";
import UserProfile from "@/components/User/UserInfo/UserProfile";

export const metadata: Metadata = {
    title: "Thông tin tài khoản",
    description: "user-profile"
};

export default function UserProfilePage() {
    return (
        <Suspense fallback={<UserLoader />}>
            <UserProfile />
        </Suspense>
    );
};
