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

const {Text} = Typography;

interface IProps {
    orderDetail: IOrderDetail;
}

const OrderedProductDetails: React.FC<IProps> = (props) => {
    const {showMessage} = useAppNotifications();
    const {id: orderId} = useParams();
    const {orderDetail} = props;

    const {
        handleGetOrderItemsByOrderId, handleUpdateQuantityOrderItem, handleDeleteOrderItem,
        handleCreateOrderItems, handleCreateOrderItemsDeliverySale
    } = useOrderItem();
    const {handleUpdateQuantityInStockProductVariant} = useProductVariant();

    const {orderItems, error, isLoading, mutateOrderItems} =
        handleGetOrderItemsByOrderId(orderId && Number(orderId) ? Number(orderId) : undefined);

    const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

    const [dataCart, setDataCart] = useState<IOrderItem[]>([]);
    const [isOpenAddProductToOrderModal, setOpenAddProductToOrderModal] = useState(false);
    const [initialQuantities, setInitialQuantities] = useState<Map<number, number>>(new Map());


    useEffect(() => {
        if (orderItems && !isEqual(orderItems, dataCart)) {
            setDataCart(orderItems);
        }
    }, [orderItems]);

    /**
     * sự kiện thay đổi số lượng qua input
     * @param orderItemId
     * @param productVariantId
     * @param value
     */
    const onChangeQuantity = (orderItemId: number, productVariantId: number, value: number | null) => {
        const newValue = Number(value);
        if (newValue && !isNaN(newValue) && newValue > 0) {
            setDataCart(prevItems =>
                prevItems.map(item =>
                    item.id === orderItemId ? {...item, quantity: newValue} : item
                )
            );
        }
    };

    /**
     * sự kiện onblur khi blur ra ngoài input sẽ lưu số lương
     * @param e
     * @param orderItemId
     * @param productVariantId
     * @param productId
     */
    const onBlurQuantity = async (e: React.FocusEvent<HTMLInputElement>, orderItemId: number, productVariantId: number, productId: number) => {
        let newValue = Number(e.target.value);

        if (isNaN(newValue)) {
            if (newValue <= 0) {
                newValue = 1;
            } else if (newValue > 100) {
                newValue = 100;
            }
        }
        // console.log("new quantity value: ", newValue)

        // lấy ra số lượng trước đó của sản phẩm thay đổi
        const oldValue = initialQuantities.get(orderItemId) || 1;

        if (newValue !== oldValue) {
            // Tính toán số lượng thay đổi
            let quantityChange = newValue - oldValue;
            // console.log('quantity change', quantityChange)

            // Cập nhật số lượng sản phẩm trong kho
            let action: string;
            if (quantityChange > 0) { // số lượng thay đổi lớn hơn không
                // console.log("quantity stock minus", quantityChange)
                action = STOCK_ACTION.MINUS_STOCK; // Giảm số lượng kho khi tăng số lượng trong giỏ
            } else { // số lượng thay đổi là âm
                quantityChange = -quantityChange;
                // console.log("quantity stock plus", quantityChange)
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
                    setDataCart(prevItems =>
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
                setDataCart(prevItems =>
                    prevItems.map(item =>
                        item.id === orderItemId ? {...item, quantity: oldValue} : item
                    )
                );
            }
        }
    };

    /**
     * nhấn enter với input để lưu số lượng
     * @param orderItemId
     */
    const handlePressEnter = (orderItemId: number) => {
        // nhấn enter sẽ blur ra ngoài input kích hoạt sự kiện blur và update số lượng
        const input = inputRefs.current.get(orderItemId);
        input?.blur();
    };

    // xử lý khi xóa sản phẩm trong giỏ
    const handleDeleteOrderItemCart = async (id: number, productId: number) => {
        setDataCart((prevCart) => prevCart.filter((item) => item.id !== id));

        await handleDeleteOrderItem(id);

        await mutate(key =>
                typeof key === 'string' && key.startsWith(`${URL_API_PRODUCT_VARIANT.filter(productId.toString())}`),
            undefined,
            {revalidate: true}
        );

        await mutateOrderItems();
    };

    // xử lý thêm sản phẩm vào giỏ
    const handleAddOrderItemCart = async (productVariantSelected: IProductVariant[]) => {
        // khởi tạo mảng giá trị rỗng để lưu trữ item sản phẩm trong giỏ
        let newOrderItemsCreateOrUpdate: ICreateOrUpdateOrderItem[] = [];

        // chuyển đổi danh sách lưu trữ dataCart sang Map để truy xuất dữ liệu nhanh hơn
        const cartMap = new Map<number, IOrderItem>(
            dataCart.map(item => [item.productVariantId, item])
        );
        // console.log("current cart", cartMap)

        // Lưu trữ bản sao của cartMap để rollback khi cần
        const cartMapBackup = new Map(cartMap);

        for (const selectedProduct of productVariantSelected) {
            const quantityInStock = selectedProduct.quantityInStock || 0;
            // console.log('quantity in stock: ', stockQuantity);

            // cập nhật số lượng với sản phẩm đã tồn tại trong giỏ
            if (cartMap.has(selectedProduct.id)) {
                // console.log("product variant id" , selectedProduct.id)
                const existingOrderItem = cartMap.get(selectedProduct.id)!;
                // console.log("current cart quantity" + selectedProduct.sku , existingOrderItem.quantity)
                if (quantityInStock > 0) {
                    let newQuantity: number = existingOrderItem.quantity + 1;

                    // console.log(`new cart quantity ${selectedProduct.sku}: ${newQuantity}`);

                    // Cập nhật số lượng trong Map
                    cartMap.set(selectedProduct.id, {
                        ...existingOrderItem,
                        quantity: newQuantity
                    })
                    // console.log("product after update", cartMap.get(selectedProduct.id));

                    newOrderItemsCreateOrUpdate.push({
                        id: existingOrderItem.id,
                        productVariantId: selectedProduct.id,
                        quantity: 1,
                        salePrice: selectedProduct.salePrice,
                    });
                } else {
                    showMessage("warning", `Sản phẩm mã ${selectedProduct.sku} - ${selectedProduct.productName} đã hết hàng`);
                    return;
                }

            } else { // cập nhật số lượng với sản phẩm đã tồn tại trong giỏ

                // Thêm sản phẩm mới vào giỏ hàng nếu tồn kho lớn hơn 0
                if (quantityInStock > 0) {
                    let quantityToAdd: number = 1;  // Thêm mặc định 1 sản phẩm

                    // thêm vào list item sản phẩm trong để cập nhật vào giỏ thiếu id để cập nhật số lượng sản phẩm
                    newOrderItemsCreateOrUpdate.push({
                        productVariantId: selectedProduct.id,
                        quantity: quantityToAdd,
                        salePrice: selectedProduct.salePrice,
                    });
                } else { // Nếu tồn kho = 0, cảnh báo người dùng
                    showMessage("warning", `Sản phẩm ${selectedProduct.sku} - ${selectedProduct.productName} đã hết hàng`);
                    return;
                }
            }
        }

        // thêm sản phẩm vào giỏ đối với các sản phẩm mới chưa có trong giỏ
        try {
            if (newOrderItemsCreateOrUpdate.length > 0) {
                let response = await handleCreateOrderItemsDeliverySale(Number(orderId), newOrderItemsCreateOrUpdate)
                if (response) {
                    productVariantSelected.forEach((selectedProduct) => {
                        const orderItemId = response[selectedProduct.id];
                        // console.log(orderItemId)
                        if (orderItemId && !cartMap.has(selectedProduct.id)) {
                            cartMap.set(selectedProduct.id, {
                                id: orderItemId,
                                orderId: Number(orderId),
                                productVariantId: selectedProduct.id,
                                sku: selectedProduct.sku,
                                productId: selectedProduct.productId,
                                productName: selectedProduct.productName,
                                colorId: selectedProduct.colorId,
                                colorCode: selectedProduct.colorCode,
                                colorName: selectedProduct.colorName,
                                sizeId: selectedProduct.sizeId,
                                sizeName: selectedProduct.sizeName,
                                quantity: 1,
                                salePrice: selectedProduct.salePrice,
                            });
                        }
                    });
                }
            }

            if (productVariantSelected.length > 0) {
                const productId = productVariantSelected[0].productId;
                await mutate((key: any) => typeof key === 'string' && productId &&
                        key.startsWith(`${URL_API_PRODUCT_VARIANT.filter(productId?.toString())}`),
                    undefined,
                    {revalidate: true}
                );
            }

            // console.log("new cart", Array.from(cartMap.values()))
            setDataCart([...Array.from(cartMap.values())]);

            await mutateOrderItems();
        } catch (error: any) {
            // Rollback giỏ hàng về trạng thái trước khi thay đổi
            setDataCart([...Array.from(cartMapBackup.values())]);
            showMessage("error", error.message || "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!");
        }
    }

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
            render: (_, record) => {
                return (
                    // nếu hóa đơn tron trạng thái chờ xác nhận mới cho sửa
                    // orderDetail?.orderType === ORDER_TYPE.DELIVERY.key &&
                    // orderDetail?.orderStatus === ORDER_STATUS.AWAITING_CONFIRMATION.key ?
                    //     (
                    //         <InputNumber<number>
                    //             className="custom-input"
                    //             key={record.id}
                    //             ref={(el) => {
                    //                 if (el) {
                    //                     inputRefs.current.set(record.id, el);
                    //                 } else {
                    //                     inputRefs.current.delete(record.id);
                    //                 }
                    //             }}
                    //             min={1}
                    //             value={record.quantity}
                    //             formatter={(value) => `${value}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                    //             parser={(value) => value?.replace(PARSER_NUMBER_WITH_COMMAS_TO_NUMBER, '') as unknown as number}
                    //             onChange={(value) => onChangeQuantity(record.id, record.productVariantId, value)}
                    //             onBlur={(e) => onBlurQuantity(e, record.id, record.productVariantId, record.productId)}
                    //             onPressEnter={() => handlePressEnter(record.id)}
                    //             style={{textAlignLast: "center", width: "100%"}}
                    //         />
                    //     )
                    //     :
                    record.quantity
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
    ];

    // nếu hóa đơn tron trạng thái chờ xác nhận mới hiển thị cột hành động
    if (orderDetail?.orderStatus === ORDER_STATUS.AWAITING_CONFIRMATION.key) {
        // Tìm cột "Hành động" và thêm nếu chưa tồn tại
        if (!columns.some(column => column.key === 'action')) {
            columns.push({
                title: 'Hành động', key: 'action', align: "center", width: 70,
                render: (_, record) => (
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
            });
        }
    } else {
        // Nếu không ở trạng thái "chờ xác nhận", thì xóa cột "Hành động" nếu có
        columns = columns.filter(column => column.key !== 'action');
    }

    return (
        <>
            <Row gutter={[24, 0]} wrap>
                <Col xs={24} sm={24} md={24} lg={24} xl={18}>
                    {/* button add product to order */}
                    <Flex justify="flex-end">
                        {
                            orderDetail?.orderType === ORDER_TYPE.DELIVERY.key &&
                            orderDetail?.orderStatus === ORDER_STATUS.AWAITING_CONFIRMATION.key &&
                            (
                                <Button type="primary" style={{marginBottom: 10}}
                                        onClick={() => setOpenAddProductToOrderModal(true)}
                                >
                                    Thêm sản phẩm
                                </Button>
                            )
                        }
                    </Flex>

                    <Table<IOrderItem>
                        rowKey="id"
                        size="small"
                        bordered={true}
                        loading={isLoading}
                        columns={columns}
                        dataSource={dataCart}
                        pagination={false}
                        scroll={{y: 'calc(100vh - 350px)', scrollToFirstRowOnChange: true}}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={6}>
                    <CheckoutInfoCard
                        orderDetail={orderDetail}
                        dataCart={dataCart}
                    />
                </Col>
            </Row>

            <AddProductToOrderModal
                isOpenAddProductToOrderModal={isOpenAddProductToOrderModal}
                setOpenAddProductToOrderModal={setOpenAddProductToOrderModal}
                handleAddOrderItemCart={handleAddOrderItemCart}
            />
        </>
    );
}
export default memo(OrderedProductDetails);