"use client";
import "../../../css/admin.css";
import React, {ReactNode} from "react";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {App} from "antd";
import AuthenticationProvider from "@/components/Context/AuthenticationProvider";


export default function AdminAccountLayout({children,}: Readonly<{ children: ReactNode; }>) {
    return (
        <>
            <AntdRegistry>
                <App>
                    <AuthenticationProvider>
                        <main>{children}</main>
                    </AuthenticationProvider>
                </App>
            </AntdRegistry>
        </>
    );
}
