"use client";
import {
    CheckOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Button,
    Flex,
    Form,
    Input,
    Radio,
    Typography,
} from "antd";

import Link from "next/link";
import {usePhoneValidation} from "@/hooks/usePhoneNumberValidation";
import useAppNotifications from "@/hooks/useAppNotifications";
import {registerCustomer} from "@/services/CustomerService";
import {useState} from "react";

interface IProps {
    handleRegisterSuccess: () => void;
}

const {Text} = Typography;

const RegisterFormOwner = ({handleRegisterSuccess}: IProps) => {
    const {validatePhoneNumber} = usePhoneValidation();
    const {showNotification} = useAppNotifications();
    const [form] = Form.useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const togglePasswordConfirmVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const onFinish = async (values: IRegister) => {
        try {
            const result = await registerCustomer(values);
            console.log(result);
            if (result) {
                form.resetFields();
                showNotification("success", {message: "Đăng kí thành công"});
                handleRegisterSuccess();
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage && typeof errorMessage === "object") {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", {message: String(message)});
                });
            } else {
                showNotification("error", {message: "Đăng kí thất bại", description: errorMessage,});
            }
        }
        console.log("Received values of form: ", values);
    };


    return (
        <Flex justify="center" align="center">
            <Form
                form={form}
                name="register"
                initialValues={{remember: true}}
                onFinish={onFinish}
                style={{width: "90%"}}
            >
                <Form.Item
                    name="fullName"
                    rules={[{required: true, message: "Vui lòng nhập họ tên!"}]}
                    style={{width: "100%", marginTop: 10}}
                >
                    <Input size="large" placeholder="Họ tên" prefix={<UserOutlined/>}/>
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    rules={[
                        {
                            validator: (_, value) => validatePhoneNumber(value),
                            required: true,
                        },
                    ]}
                    style={{width: "100%", marginTop: 10}}
                >
                    <Input
                        size="large"
                        placeholder="Số điện thoại"
                        prefix={<PhoneOutlined/>}
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        {
                            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                            message: 'Email không đúng định dạng!',
                        },
                    ]}
                    style={{width: "100%", marginTop: 10}}
                >
                    <Input size="large" placeholder="Email" prefix={<MailOutlined/>}/>
                </Form.Item>
                <Form.Item name="gender" initialValue="0">
                    <Radio.Group>
                        <Radio value="0">Nam</Radio>
                        <Radio value="1">Nữ</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            validator: (_, value) => {
                                if (value && value.length >= 5 && value.length <= 10) {
                                    return Promise.resolve(); // Hợp lệ
                                }
                                return Promise.reject(
                                    new Error("Mật khẩu phải có độ dài từ 5 đến 10 ký tự!")
                                );
                            },
                        },
                    ]}
                    style={{width: "100%", marginTop: 10}}
                >
                    <Input
                        size="large"
                        prefix={<LockOutlined/>}
                        suffix={
                            showPassword ? (
                                <EyeOutlined onClick={togglePasswordVisibility}/>
                            ) : (
                                <EyeInvisibleOutlined onClick={togglePasswordVisibility}/>
                            )
                        }
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                    />
                </Form.Item>

                <Form.Item
                    name="passwordComfirm"
                    rules={[
                        {
                            validator: (_, value) => {
                                if (value && value.length >= 5 && value.length <= 10) {
                                    return Promise.resolve(); // Hợp lệ
                                }
                                return Promise.reject(
                                    new Error("Mật khẩu phải có độ dài từ 5 đến 10 ký tự!")
                                );
                            },
                        },
                    ]}
                    style={{width: "100%"}}
                >
                    <Input
                        size="large"
                        prefix={<CheckOutlined/>}
                        suffix={
                            showConfirmPassword ? (
                                <EyeOutlined onClick={togglePasswordConfirmVisibility}/>
                            ) : (
                                <EyeInvisibleOutlined onClick={togglePasswordConfirmVisibility}/>
                            )
                        }
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu"
                    />
                </Form.Item>

                <Form.Item label={null}>
                    <Flex justify="center" align="center">
                        <Button type="primary" htmlType="submit" size="large">
                            Đăng ký
                        </Button>
                    </Flex>
                </Form.Item>

                <Form.Item>
                    <Flex justify="center" align="center">
                        Bạn đã có tài khoản?
                        <Text
                            style={{
                                marginInlineStart: 4,
                                textDecoration: "none",
                                color: "#F7941D",
                                cursor: "pointer",
                            }}
                        >
                            Đăng nhập
                        </Text>
                    </Flex>
                    <Flex justify="center" align="center">
                        <Text>
                            Bạn quên mật khẩu?
                            <Link
                                href="/"
                                style={{
                                    marginInlineStart: 4,
                                    textDecoration: "none",
                                    color: "#F7941D",
                                }}
                            >
                                Quên mật khẩu?
                            </Link>
                        </Text>
                    </Flex>
                </Form.Item>
            </Form>
        </Flex>
    );
};

export default RegisterFormOwner;
