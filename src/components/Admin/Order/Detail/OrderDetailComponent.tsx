"use client"
import React, { useRef } from "react";
import Link from "next/link";
import { HomeOutlined } from "@ant-design/icons";
import {
    Breadcrumb, Button,
    Layout,
    theme,
    Typography
} from "antd";
import { useParams } from "next/navigation";
import OrderedProductDetails from "@/components/Admin/Order/Detail/OrderedProductDetails";
import TimeLineOrderTrackingComponent from "@/components/Admin/Order/Detail/TimeLineOrderTrackingComponent";
import useOrder from "@/components/Admin/Order/hooks/useOrder";
import OrderDetailInfoTable from "@/components/Admin/Order/Detail/OrderDetailInfoTable";
import InvoiceComponent from "../../../User/Invoice/InvoiceComponent";
import OrderDetailProvider from "@/components/Admin/Order/Detail/Context/OrderDetailProvider";

const { Content } = Layout;
const { Title, Text } = Typography;

interface IProps {

}

const OrderDetailComponent: React.FC<IProps> = (props) => {
    const { token } = theme.useToken();
    const { id } = useParams();
    const { handleGetOrderDetail } = useOrder();
    const { orderDetail, error, isLoading, mutate } =
        handleGetOrderDetail(id && Number(id) ? Number(id) : null);

    return (
        <>
            <OrderDetailProvider>
                <Breadcrumb
                    items={[
                        { title: <Link href={"/admin"}><HomeOutlined /></Link>, },
                        { title: <Link href={"/admin/order"}>Hóa đơn</Link>, },
                        { title: 'Chi tiết' },
                    ]}
                />

                <Title level={4} style={{ margin: '20px 10px 10px 10px' }}>
                    Mã đơn hàng
                    <Text type="secondary" style={{ marginInlineStart: 10, fontSize: 20 }}>
                        {orderDetail?.orderTrackingNumber}
                    </Text>
                </Title>
                <Content
                    style={{
                        backgroundColor: token.colorBgContainer,
                        padding: 30
                    }}
                >
                    <TimeLineOrderTrackingComponent orderDetail={orderDetail} mutate={mutate} />
                </Content>

                <Title level={4} style={{ margin: '20px 10px 10px 10px' }}>
                    Thông tin đơn hàng
                </Title>
                <Content style={{ backgroundColor: token.colorBgContainer, padding: 20 }}>
                    <OrderDetailInfoTable orderDetail={orderDetail} />
                </Content>

                <Title level={4} style={{ margin: '20px 10px 10px 10px' }}>
                    Danh sách sản phẩm đã đặt mua
                </Title>
                <Content
                    style={{
                        backgroundColor: token.colorBgContainer,
                        borderRadius: token.borderRadiusLG,
                        padding: 20
                    }}>
                    <OrderedProductDetails orderDetail={orderDetail} />
                </Content>
            </OrderDetailProvider>
        </>
    );
}
export default OrderDetailComponent;
