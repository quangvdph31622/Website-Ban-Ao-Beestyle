import React, { memo } from "react";
import { MdEmail, MdLocalPhone, MdLogin } from 'react-icons/md';
import { AiOutlineUser } from "react-icons/ai";
import Link from "next/link";
import { Divider, Flex, Typography } from "antd";
import { useAuthentication } from "@/components/Context/AuthenticationProvider";


const { Text } = Typography;

const TopBar: React.FC = () => {
    const authentication = useAuthentication();

    return (
        <>
            <div style={{ backgroundColor: '#333', padding: "15px 30px" }}>
                <Flex justify="space-between" align="center" wrap>
                    <Flex gap={8} align="center">
                        <Flex align="center">
                            <MdLocalPhone size={18} style={{ color: '#F7941D', marginInlineEnd: 7 }} />
                            <Text className="text-white">+84 352 258 379</Text>
                        </Flex>
                        <Divider style={{ borderColor: '#ffffff' }} type="vertical" />
                        <Flex align="center">
                            <MdEmail size={18} style={{ color: '#F7941D', marginInlineEnd: 7 }} />
                            <Text className="text-white">support@beestyle.com</Text>
                        </Flex>
                    </Flex>

                    <Flex gap={8} align="center">
                        <Flex align="center">
                            <AiOutlineUser size={18} style={{ color: '#F7941D', marginInlineEnd: 7 }} />
                            <Link href="#" style={{ textDecoration: 'none' }}>
                                <Text className="text-white">
                                    {authentication?.authentication ? authentication.authentication.user.fullName : "Guest"}
                                </Text>
                            </Link>
                        </Flex>
                        {
                            authentication?.authentication ? (
                                <>
                                    <Divider style={{ borderColor: '#ffffff' }} type="vertical" />
                                    <Flex align="center" style={{ cursor: "pointer" }} onClick={authentication?.logout}>
                                        <MdLogin size={18} style={{ color: '#F7941D', marginInlineEnd: 7 }} />
                                        <Text className="text-white">Đăng xuất</Text>
                                    </Flex>
                                </>
                            ) : (
                                <></>
                            )
                        }
                    </Flex>
                </Flex>
            </div>
        </>
    )
};
export default memo(TopBar);
