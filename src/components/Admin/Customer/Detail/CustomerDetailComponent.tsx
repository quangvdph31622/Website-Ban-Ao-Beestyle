"use client";
import useAppNotifications from "@/hooks/useAppNotifications";
import {
    getDetailCustomer,
    URL_API_CUSTOMER,
} from "@/services/CustomerService";
import {Breadcrumb, Layout, Row, Col, Typography, theme} from "antd";
import React, {useEffect} from "react";
import useSWR from "swr";
import InformationCustomer from "./InformationCustomer";
import AddressComponent from "../../Address/AddressComponent";
import {HomeOutlined} from "@ant-design/icons";
import {Content} from "antd/es/layout/layout";

const {Title} = Typography;

interface IProps {
    customerId: string;
}

const CustomerDetailComponent = (props: IProps) => {
    const {showNotification} = useAppNotifications();
    const {token} = theme.useToken();
    const {customerId} = props;

    const {data, error, isLoading, mutate} = useSWR(
        `${URL_API_CUSTOMER.get}/${customerId}`,
        getDetailCustomer,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    useEffect(() => {
        if (error) {
            showNotification("error", {
                message: error?.message,
                description: error?.response?.data?.message || "Error fetching data",
            });
        }
    }, [error]);

    let result: any;
    if (!isLoading && data) {
        result = data?.data;
    }

    return (
        <>
            <Breadcrumb
                items={[
                    {href: "/admin", title: <HomeOutlined/>},
                    {title: "Khách hàng", href: "/admin/customer"},
                    {title: "Chi tiết"},
                ]}
                style={{marginBottom: "20px"}}
            />
            <Title level={3} style={{marginBottom: "20px", marginLeft: 10}}>
                Thông tin khách hàng
            </Title>
            <Layout>
                <Row gutter={[16, 0]}
                     style={{height: "100%",}}
                >
                    {/* Cột thông tin khách hàng */}
                    <Col xs={24} md={14}>
                        <div
                            style={{
                                background: "#fff",
                                padding: "20px",
                                borderTopLeftRadius: "8px",
                                borderBottomLeftRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                height: "100%"
                            }}
                        >
                            <InformationCustomer mutate={mutate} customer={result}/>
                        </div>
                    </Col>

                    {/* Cột địa chỉ */}
                    <Col xs={24} md={10}>
                        <div
                            style={{
                                background: "#fff",
                                padding: "20px",
                                borderBottomRightRadius: "8px",
                                borderTopRightRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                height: "100%"
                            }}
                        >
                            <Title level={4} style={{marginBottom: "20px"}}>Địa chỉ</Title>
                            <AddressComponent/>
                        </div>
                    </Col>
                </Row>
            </Layout>
        </>
    );
};

export default CustomerDetailComponent;
