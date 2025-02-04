import { Metadata } from "next";
import { Suspense } from "react";
import UserLoader from "@/components/Loader/UserLoader";
import FashionNews from "@/components/User/News/FashionNews";

export const metadata: Metadata = {
    title: "Tin thời trang",
    description: "news"
};

export default function Home() {
    return (
        <Suspense fallback={<UserLoader />}>
            <FashionNews />
        </Suspense>
    );
}
