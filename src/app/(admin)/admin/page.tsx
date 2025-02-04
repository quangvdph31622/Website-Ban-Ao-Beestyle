import { Metadata } from "next";
import Dashboard from "@/components/Dashboard/Dashboard";
import { Suspense } from "react";
import AdminLoader from "@/components/Loader/AdminLoader";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "dashboard",
};

export default function HomeAdmin() {
    return (
        <>
            <Suspense fallback={<AdminLoader />}>
                <Dashboard />
            </Suspense>
        </>
    );
}
