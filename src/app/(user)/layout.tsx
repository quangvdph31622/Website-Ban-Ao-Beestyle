"use client";
import "../../css/user.css";
import React, { ReactNode } from "react";
import { App, FloatButton } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import UserLayout from "@/components/Layout/UserLayout";
import AuthenticationProvider from "@/components/Context/AuthenticationProvider";
import useLogoutListener from "@/hooks/useLogoutListener";

export default function RootUserLayout({ children, }: Readonly<{ children: ReactNode; }>) {
    useLogoutListener();
    return (
        <>
            <AntdRegistry>
                <App>
                    <AuthenticationProvider>
                        <UserLayout>
                            <main>{children}</main>
                        </UserLayout>
                    </AuthenticationProvider>
                </App>
            </AntdRegistry>
            <FloatButton.BackTop visibilityHeight={400} />
        </>
    );
}
