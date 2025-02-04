"use client";
import "../css/globals.css";
import React, {ReactNode, useEffect, useState} from "react";
import AdminLoader from "@/components/Loader/AdminLoader";
import {App, FloatButton} from "antd";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {usePathname} from "next/navigation";
import UserLoader from "@/components/Loader/UserLoader";


export default function RootLayout({children,}: Readonly<{ children: ReactNode; }>) {
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const pathname = usePathname();

    const handleLoad = () => setLoading(false);

    useEffect(() => {
        if (pathname.startsWith("/admin")) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, [pathname, loading]);

    return (
        <html lang="en" suppressHydrationWarning={true}>
        <head>
            <link rel="icon" href="/b_icon.png"/>
        </head>
        <body suppressHydrationWarning={true}>
        {
            loading ?
                (
                    isAdmin ? <AdminLoader/> : <UserLoader/>
                ) : (
                    <AntdRegistry>
                        <App>
                            <main>{children}</main>
                        </App>
                    </AntdRegistry>
                )
        }
        <FloatButton.BackTop visibilityHeight={400}/>
        </body>
        </html>
    );
}
