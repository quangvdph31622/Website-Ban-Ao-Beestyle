import { Metadata } from "next";
import { Suspense } from "react";
import UserLoader from "@/components/Loader/UserLoader";
import BlogPage from "@/components/User/News/BlogPage";

export const metadata: Metadata = {
    title: "Tin thời trang",
    description: "news"
};

export default function Home() {
    return (
        <Suspense fallback={<UserLoader />}>
            <BlogPage />
        </Suspense>
    );
}
