'use client';
import { Button, Flex, Form, Input, Typography } from "antd";
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import useAppNotifications from "@/hooks/useAppNotifications";
import { IAuthResponse, ISignIn } from "@/types/IAuth";
import { signIn } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuthentication } from "@/components/Context/AuthenticationProvider";
import { fetchCartFromLocalToServer } from "@/services/user/ShoppingCartService";
import { getAccountInfo } from "@/utils/AppUtil";
import UserLoader from "@/components/Loader/UserLoader";

const { Text } = Typography;

const LoginFormOwner: React.FC = () => {
    const { showNotification } = useAppNotifications();
    const authentication = useAuthentication();
    const router = useRouter();
    const [form] = Form.useForm();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    if (getAccountInfo()) {
        router.push('/');
    }

    const togglePasswordConfirmVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const onFinish = async (value: ISignIn) => {
        try {
            const result: IAuthResponse = await signIn(value);

            if (result) {
                authentication?.login(result);
                form.resetFields();
                fetchCartFromLocalToServer();
                router.push("/");
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
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
            {getAccountInfo() ? (<UserLoader />) : (
                <>
                    <Flex justify="center" align="center">
                        <Form
                            form={form}
                            name="login"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            style={{ width: "90%" }}
                        >
                            <Form.Item<ISignIn>
                                name="username"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập Email!' },
                                    {
                                        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                                        message: 'Email không đúng định dạng!',
                                    },
                                ]}
                                style={{ width: "100%", marginTop: 10 }}
                            >
                                <Input size="large" placeholder="Email" prefix={<UserOutlined />} />
                            </Form.Item>

                            <Form.Item<ISignIn>
                                name="password"
                                rules={[
                                    {
                                        validator: (_, value) => {
                                            if (value && value.length >= 5 && value.length <= 10) {
                                                return Promise.resolve(); // Hợp lệ
                                            }
                                            return Promise.reject(new Error('Mật khẩu phải có độ dài từ 5 đến 10 ký tự!'));
                                        }
                                    }

                                ]}
                                style={{ width: "100%" }}
                            >
                                <Input
                                    size="large"
                                    prefix={<LockOutlined />}
                                    suffix={
                                        showPassword ? (
                                            <EyeOutlined onClick={togglePasswordVisibility} />
                                        ) : (
                                            <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
                                        )
                                    }
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mật khẩu"
                                />
                            </Form.Item>

                            <Form.Item label={null}>
                                <Flex justify="center" align="center">
                                    <Button type="primary" htmlType="submit" size="large">
                                        Đăng nhập
                                    </Button>
                                </Flex>
                            </Form.Item>

                            <Form.Item>
                                <Flex justify="center" align="center">
                                    Bạn chưa có tài khoản?
                                    <Text style={{
                                        marginInlineStart: 4,
                                        textDecoration: 'none',
                                        color: '#F7941D',
                                        cursor: "pointer"
                                    }}>
                                        Đăng ký
                                    </Text>
                                </Flex>
                                <Flex justify="center" align="center">
                                    <Text>
                                        Bạn quên mật khẩu?
                                        <Link href="/" style={{ marginInlineStart: 4, textDecoration: 'none', color: '#F7941D' }}>
                                            Quên mật khẩu?
                                        </Link>
                                    </Text>
                                </Flex>
                            </Form.Item>
                        </Form>
                    </Flex>
                </>
            )}
        </>
    );
};

export default LoginFormOwner;
