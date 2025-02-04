import React, {memo, useEffect, useRef, useState} from "react";
import {Button, Col, Flex, Popconfirm, Row, Table, TableProps, Tag, Tooltip, Typography} from "antd";
import {ICreateOrUpdateOrderItem, IOrderItem} from "@/types/IOrderItem";
import {FORMAT_NUMBER_WITH_COMMAS} from "@/constants/AppConstants";
import {DeleteOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import useOrderItem from "@/components/Admin/Order/hooks/useOrderItem";
import useProductVariant from "@/components/Admin/Product/Variant/hooks/useProductVariant";
import {STOCK_ACTION} from "@/constants/StockAction";
import {mutate} from "swr";
import {URL_API_PRODUCT_VARIANT} from "@/services/ProductVariantService";
import useAppNotifications from "@/hooks/useAppNotifications";
import {useParams} from "next/navigation";
import {ORDER_TYPE} from "@/constants/OrderType";
import {IOrderDetail} from "@/types/IOrder";
import {ORDER_STATUS} from "@/constants/OrderStatus";
import AddProductToOrderModal from "@/components/Admin/Order/Detail/ModalAddProductToOrder";
import {IProductVariant} from "@/types/IProductVariant";
import CheckoutInfoCard from "@/components/Admin/Order/Detail/CheckoutInfoCard";
import {isEqual} from "lodash";
import CheckoutInfoCardUser from "@/components/User/OrderTracking/CheckoutInfoCardUser";

const {Text} = Typography;

interface IProps {
    orderDetail: IOrderDetail;
}

const OrderedProductDetailsUser: React.FC<IProps> = (props) => {
    const {orderDetail} = props;
    const {handleGetOrderItemsByOrderId} = useOrderItem();

    const {orderItems, error, isLoading, mutateOrderItems} =
        handleGetOrderItemsByOrderId(orderDetail?.id  ? orderDetail.id : undefined);

    const [dataCart, setDataCart] = useState<IOrderItem[]>([]);


    useEffect(() => {
        if (orderItems && !isEqual(orderItems, dataCart)) {
            setDataCart(orderItems);
        }
    }, [orderItems]);

    let columns: TableProps<IOrderItem>['columns'] = [
        {
            title: '#', key: '#', align: "center", width: 40,
            render: (value, record, index) => <Text strong>{index + 1}</Text>,
        },
        {
            title: 'Sản phẩm', dataIndex: 'product', key: 'product', width: 250,
            render: (value, record, index) => {
                return (
                    <div className="ml-1">
                        <Text type="secondary">{record.sku}</Text> | <Text>{record.productName}</Text><br/>
                        <Text type="secondary" style={{display: "flex", alignItems: "center"}}>
                            <span style={{marginInlineEnd: 4}}>
                                {`Màu: ${record.colorName}`}
                            </span>
                            {record.colorCode ? <Tag className="custom-tag" color={record.colorCode}/> : ""} |
                            {` Kích cỡ: ${record.sizeName}`}
                        </Text>
                    </div>
                );
            }
        },
        {
            title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', align: "center", width: 100,
        },
        {
            title: 'Đơn giá', dataIndex: 'price', key: 'price', align: "right", width: 100,
            render: (_, record) => {
                return `${record.salePrice}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',');
            }
        },
        {
            title: 'Tổng giá', key: 'totalPrice', align: "right", width: 100,
            render: (_, record) => {
                return (
                    <Text strong>
                        {`${(record.quantity ?? 0) * (record.salePrice ?? 0)}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                    </Text>
                );
            }
        },
    ];

    return (
        <>
            <Row gutter={[24, 0]} wrap>
                <Col xs={24} sm={24} md={24} lg={24} xl={18}>
                    <Table<IOrderItem>
                        rowKey="id"
                        size="small"
                        bordered={true}
                        loading={isLoading}
                        columns={columns}
                        dataSource={dataCart}
                        pagination={false}
                        scroll={{scrollToFirstRowOnChange: true}}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={6}>
                    <CheckoutInfoCardUser
                        orderDetail={orderDetail}
                        dataCart={dataCart}
                    />
                </Col>
            </Row>
        </>
    );
}
export default memo(OrderedProductDetailsUser);