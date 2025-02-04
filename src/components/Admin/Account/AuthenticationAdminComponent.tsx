/* eslint-disable @next/next/no-img-element */
"use client"
import useAppNotifications from "@/hooks/useAppNotifications";
import { useRouter } from "next/navigation";
import { Button, Card, Flex, Form, Input, Typography } from "antd";
import { IAuthResponse, ISignIn } from "@/types/IAuth";
import { signIn } from "@/services/AuthService";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { getAdminAccountInfo } from "@/utils/AppUtil";
import AdminLoader from "@/components/Loader/AdminLoader";

const AuthenticationAdminComponent: React.FC = () => {
    const { showNotification } = useAppNotifications();
    // const authenticationAdmin = useContext(AuthenticationContext);
    const router = useRouter();
    const [form] = Form.useForm();

    if (getAdminAccountInfo() && getAdminAccountInfo()?.role == "ADMIN") {
        router.push('/admin');
    } else if (getAdminAccountInfo()) {
        router.push('/admin-counter-sale');
    }

    const onFinish = async (value: ISignIn) => {
        try {
            const result: IAuthResponse = await signIn(value);
            console.log(result);
            if (result) {
                localStorage.setItem("authenticationAdmin", JSON.stringify(result));
                form.resetFields();

                if (result?.user?.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    router.push("/admin-counter-sale");
                }
            }
        } catch (error: any) {
            const errorMessage = error?.response?.message;
            console.log(error);
            if (errorMessage && typeof errorMessage === 'object') {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", { message: String(message) });
                });
            } else {
                showNotification("error", { message: error?.message, description: errorMessage, });
            }
        }
    };

    return (
        <>
            {getAdminAccountInfo() ? (<AdminLoader />) : (
                <>
                    <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
                        <Flex vertical align="center" gap="large">
                            <img src="/logo.png" alt="BEESTYLE" width={200} />
                            <Card style={{ width: 400 }}>
                                <Typography.Title
                                    level={3}
                                    style={{ textAlign: 'center', marginBottom: 24 }}
                                >
                                    Đăng nhập
                                </Typography.Title>
                                <Form
                                    name="login"
                                    initialValues={{ remember: true }}
                                    onFinish={onFinish}
                                    style={{ width: '90%', margin: '0 auto' }}
                                >
                                    <Form.Item
                                        name="username"
                                        rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
                                        style={{ width: '100%', marginBottom: 16 }}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Tên đăng nhập"
                                            prefix={<UserOutlined />}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập mật khẩu!'
                                            },
                                            {
                                                min: 5,
                                                message: 'Mật khẩu phải có ít nhất 5 ký tự!'
                                            },
                                            {
                                                max: 10,
                                                message: 'Mật khẩu không được vượt quá 10 ký tự!'
                                            }
                                        ]}
                                        style={{ width: '100%', marginBottom: 24 }}
                                    >
                                        <Input.Password
                                            size="large"
                                            prefix={<LockOutlined />}
                                            placeholder="Mật khẩu"
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Flex justify="center">
                                            <Button type="primary" htmlType="submit" size="large" block>
                                                Đăng nhập
                                            </Button>
                                        </Flex>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Flex>
                    </Flex>
                </>
            )}
        </>
    );
}
export default AuthenticationAdminComponent;
