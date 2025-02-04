import React, {memo, useContext, useEffect, useMemo, useRef, useState} from "react";
import {Button, InputNumber, Popconfirm, Popover, Table, TableProps, Tag, Tooltip, Typography} from "antd";
import {DeleteOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {HandleSale} from "@/components/Admin/Sale/SaleComponent";
import {FORMAT_NUMBER_WITH_COMMAS, PARSER_NUMBER_WITH_COMMAS_TO_NUMBER} from "@/constants/AppConstants";
import {IOrderItem} from "@/types/IOrderItem";
import {mutate} from "swr";
import useOrderItem from "@/components/Admin/Order/hooks/useOrderItem";
import useAppNotifications from "@/hooks/useAppNotifications";
import {URL_API_PRODUCT_VARIANT} from "@/services/ProductVariantService";
import useProductVariant from "@/components/Admin/Product/Variant/hooks/useProductVariant";
import {STOCK_ACTION} from "@/constants/StockAction";
import {calculateCartOriginAmount, calculateCartTotalQuantity} from "@/utils/AppUtil";

const {Text} = Typography;

const AdminCart: React.FC = () => {
    const handleSale = useContext(HandleSale);
    const {showMessage} = useAppNotifications();
    const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map());
    const [initialQuantities, setInitialQuantities] = useState<Map<number, number>>(new Map());
    const {handleGetOrderItemsByOrderId, handleUpdateQuantityOrderItem, handleDeleteOrderItem} = useOrderItem();
    const {handleUpdateQuantityInStockProductVariant} = useProductVariant();

    const {orderItems, error, isLoading, mutateOrderItems} =
        handleGetOrderItemsByOrderId(Number(handleSale?.orderActiveTabKey));

    useEffect(() => {
        if (!isLoading && orderItems) {
            handleSale?.setDataCart(orderItems);

            // lưu trữ số lượng ban đầu của các sản phẩm trong giỏ để xử lý update sản phẩm trong kho
            const initialQuantityMap: Map<number, number> = new Map();
            orderItems.forEach((item: any) => {
                initialQuantityMap.set(item.id, item.quantity);
            });
            setInitialQuantities(initialQuantityMap);

            // tính toán tổng tiền hàng và só lượng trong giỏ
            handleSale?.setTotalQuantityCart(calculateCartTotalQuantity(orderItems));
            handleSale?.setTotalAmountCart(calculateCartOriginAmount(orderItems));
        }
    }, [orderItems]);

    const onChangeQuantity = (orderItemId: number, productVariantId: number, value: number | null) => {
        const newValue = Number(value);
        if (newValue && !isNaN(newValue) && newValue > 0) {
            handleSale?.setDataCart(prevItems =>
                prevItems.map(item =>
                    item.id === orderItemId ? {...item, quantity: newValue} : item
                )
            );
        }
    };

    const onBlurQuantity = async (e: React.FocusEvent<HTMLInputElement>, orderItemId: number, productVariantId: number, productId: number) => {
        let newValue = Number(e.target.value);

        if (isNaN(newValue)) {
            if (newValue <= 0) {
                newValue = 1;
            } else if (newValue > 100) {
                newValue = 100;
            }
        }

        const oldValue = initialQuantities.get(orderItemId) || 1;

        if (newValue !== oldValue) {
            // Tính toán số lượng thay đổi
            let quantityChange = newValue - oldValue;

            // Cập nhật số lượng sản phẩm trong kho
            let action: string;
            if (quantityChange > 0) {

                action = STOCK_ACTION.MINUS_STOCK; // Giảm số lượng kho khi tăng số lượng trong giỏ
            } else {
                quantityChange = -quantityChange;

                action = STOCK_ACTION.PLUS_STOCK; // Tăng số lượng kho khi giảm số lượng trong giỏ
            }

            try {
                await handleUpdateQuantityInStockProductVariant({
                    id: productVariantId,
                    quantity: quantityChange
                }, action);

                try {
                    // cập nhật số lượng mới cho sản phẩm trong giỏ
                    await handleUpdateQuantityOrderItem({id: orderItemId, productVariantId, quantity: newValue})

                    // Cập nhật số lượng ban đầu mới
                    setInitialQuantities(prev => new Map(prev.set(orderItemId, newValue)));

                    // cập tổng số lượng sản phẩm
                    // await mutate(key =>
                    //         typeof key === 'string' && key.startsWith(`${URL_API_PRODUCT.filter}`),
                    //     undefined,
                    //     {revalidate: true}
                    // );

                    // Cập nhật lại số lượng biến thể sản phẩm trong hiển thị cho danh sách biến thể sản phẩm
                    await mutate(key =>
                            typeof key === 'string' && key.startsWith(`${URL_API_PRODUCT_VARIANT.filter(productId.toString())}`),
                        undefined,
                        {revalidate: true}
                    );

                    await mutateOrderItems();
                } catch (e) {
                    showMessage("error", "Cập nhật số lượng thất bại.");

                    // Khôi phục lại giỏ hàng với số lượng cũ
                    handleSale?.setDataCart(prevItems =>
                        prevItems.map(item =>
                            item.id === orderItemId ? {...item, quantity: oldValue} : item
                        )
                    );

                    // Rollback số lượng kho bằng cách làm ngược lại hành động trước đó
                    const rollbackAction = action === STOCK_ACTION.MINUS_STOCK ? STOCK_ACTION.PLUS_STOCK : STOCK_ACTION.MINUS_STOCK;
                    await handleUpdateQuantityInStockProductVariant({
                        id: productVariantId,
                        quantity: quantityChange
                    }, rollbackAction);
                }
            } catch (e) {
                showMessage("error", "Cập nhật số lượng thất bại.");

                // Khôi phục lại giỏ hàng với số lượng cũ
                handleSale?.setDataCart(prevItems =>
                    prevItems.map(item =>
                        item.id === orderItemId ? {...item, quantity: oldValue} : item
                    )
                );
            }
        }
    };

    const handlePressEnter = (orderItemId: number) => {
        // nhấn enter sẽ blur ra ngoài input kích hoạt sự kiện blur và update số lượng
        const input = inputRefs.current.get(orderItemId);
        input?.blur();
    };

    const handleDeleteOrderItemCart = async (id: number, productId: number) => {
        handleSale?.setDataCart((prevCart) => prevCart.filter((item) => item.id !== id));

        try {
            // delete order item
            await handleDeleteOrderItem(id);

            // refresh list product variant by product id
            await mutate(key =>
                    typeof key === 'string' && key.startsWith(`${URL_API_PRODUCT_VARIANT.filter(productId.toString())}`),
                undefined,
                {revalidate: true}
            );

            // refresh list data cart by order id
            await mutateOrderItems();
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const columns: TableProps<IOrderItem>['columns'] = [
        {
            title: '#', key: '#', align: "center", width: 40,
            render: (value, record, index) => <Text strong>{index + 1}</Text>,
        },
        {
            title: 'Sản phẩm', dataIndex: 'product', key: 'product', width: 350,
            render: (value, record, index) => {
                return (
                    <div className="ml-1">
                        <Text type="secondary">{record.sku} | </Text>
                        <Text> {record.productName}</Text><br/>
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
            render: (_, record) => {
                return (
                    <InputNumber<number>
                        className="custom-input"
                        key={record.id}
                        ref={(el) => {
                            if (el) {
                                inputRefs.current.set(record.id, el);
                            } else {
                                inputRefs.current.delete(record.id);
                            }
                        }}
                        min={1}
                        value={record.quantity}
                        formatter={(value) => `${value}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                        parser={(value) => value?.replace(PARSER_NUMBER_WITH_COMMAS_TO_NUMBER, '') as unknown as number}
                        onChange={(value) => onChangeQuantity(record.id, record.productVariantId, value)}
                        onBlur={(e) => onBlurQuantity(e, record.id, record.productVariantId, record.productId)}
                        onPressEnter={() => handlePressEnter(record.id)}
                        style={{textAlignLast: "center", width: "100%"}}
                    />
                )
            }
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
        {
            title: 'Hành động', key: 'action', align: "center", width: 70,
            render:
                (_, record) => (
                    <Tooltip title="Xóa sản phẩm">
                        <Popconfirm
                            title="Xóa sản phẩm"
                            description="Xác nhận xóa sản phẩm khỏi giỏ?"
                            icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                            onConfirm={() => handleDeleteOrderItemCart(record.id, record.productId)}
                        >
                            <Button
                                type="text"
                                shape="circle"
                                icon={<DeleteOutlined/>}
                            />
                        </Popconfirm>
                    </Tooltip>
                ),
        },
    ];

    return (
        <Table<IOrderItem>
            rowKey="id"
            loading={isLoading}
            size="small"
            pagination={false}
            columns={columns}
            dataSource={handleSale?.dataCart}
            scroll={{y: 'calc(100vh - 350px)', scrollToFirstRowOnChange: true}}
        />

    );
}
export default memo(AdminCart);