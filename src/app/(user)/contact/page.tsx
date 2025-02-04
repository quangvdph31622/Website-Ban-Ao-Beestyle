import {Metadata} from "next";
import { Suspense } from "react";
import UserLoader from "@/components/Loader/UserLoader";
import Contact from "@/components/User/Contact/Contact";

export const metadata: Metadata = {
    title: "Liên hệ",
    description: "contact"
};

export default function ContactPage() {
    return (
        <Suspense fallback={<UserLoader/>}>
            <Contact />
        </Suspense>
    );
}
