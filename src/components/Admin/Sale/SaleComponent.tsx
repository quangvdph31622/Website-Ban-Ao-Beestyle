"use client"
import React, { createContext, CSSProperties, useEffect, useState } from "react";
import { Layout, Spin, Tabs, TabsProps, theme } from "antd";
import ContentTabPanelSale from "@/components/Admin/Sale/ContentTabPanelSale";
import TabBarExtraContentLeft from "@/components/Admin/Sale/TabBarExtraContent/TabBarExtraContentLeft";
import TabBarExtraContentRight from "@/components/Admin/Sale/TabBarExtraContent/TabBarExtraContentRight";
import { IProductVariant } from "@/types/IProductVariant";
import useSWR, { KeyedMutator, mutate } from "swr";
import { getOrders, URL_API_ORDER } from "@/services/OrderService";
import { IOrder, IOrderCreateOrUpdate } from "@/types/IOrder";
import useAppNotifications from "@/hooks/useAppNotifications";
import { ICreateOrUpdateOrderItem, IOrderItem } from "@/types/IOrderItem";
import useOrder from "@/components/Admin/Order/hooks/useOrder";
import useOrderItem from "@/components/Admin/Order/hooks/useOrderItem";
import { URL_API_PRODUCT_VARIANT } from "@/services/ProductVariantService";
import { URL_API_ORDER_ITEM } from "@/services/OrderItemService";
import { calculateCartOriginAmount, calculateCartTotalQuantity, getAdminAccountInfo } from "@/utils/AppUtil";
import { PAYMENT_METHOD } from "@/constants/PaymentMethod";
import { ORDER_TYPE } from "@/constants/OrderType";
import { ORDER_CHANEL } from "@/constants/OrderChanel";
import { ORDER_STATUS } from "@/constants/OrderStatus";
import AdminLoader from "@/components/Loader/AdminLoader";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
type PositionType = 'left' | 'right';
const { Content } = Layout;

const tabBarStyle: CSSProperties = {
    height: 45,
};

const OperationsSlot: Record<PositionType, React.ReactNode> = {
    left: <TabBarExtraContentLeft />,
    right: <TabBarExtraContentRight />,
};

const defaultOrderCreateOrUpdate: IOrderCreateOrUpdate = {
    shippingFee: 0,
    originalAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    amountPaid: 0,
    paymentMethod: PAYMENT_METHOD.CASH.key,
    orderType: ORDER_TYPE.IN_STORE_PURCHASE.key,
    orderChannel: ORDER_CHANEL.OFFLINE.key,
    orderStatus: ORDER_STATUS.PENDING.key,
};

interface HandleCartContextType {
    totalQuantityCart: number;
    setTotalQuantityCart: React.Dispatch<React.SetStateAction<number>>;
    totalAmountCart: number;
    setTotalAmountCart: React.Dispatch<React.SetStateAction<number>>;
    orderCreateOrUpdate: IOrderCreateOrUpdate;
    setOrderCreateOrUpdate: React.Dispatch<React.SetStateAction<IOrderCreateOrUpdate>>;
    orderActiveTabKey: string;
    dataCart: IOrderItem[];
    setDataCart: React.Dispatch<React.SetStateAction<IOrderItem[]>>;
    handleAddOrderItemCart: (productVariantSelected: IProductVariant[]) => void;
    mutateOrderPending: KeyedMutator<any>;
}

export const HandleSale = createContext<HandleCartContextType | null>(null);

const SaleComponent: React.FC = () => {
    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
    const { showNotification, showMessage } = useAppNotifications();
    const { data, error, isLoading, mutate: mutateOrderPending } =
        useSWR(`${URL_API_ORDER.getOrderPending}`,
            getOrders,
            {
                revalidateIfStale: false,
                revalidateOnReconnect: false
            }
        );

    const { loading, handleCreateOrder, handleUpdateOrder } = useOrder();
    const { handleCreateOrderItems } = useOrderItem();
    const [orderCreateOrUpdate, setOrderCreateOrUpdate] = useState<IOrderCreateOrUpdate>(defaultOrderCreateOrUpdate);
    const [totalQuantityCart, setTotalQuantityCart] = useState<number>(0);
    const [totalAmountCart, setTotalAmountCart] = useState<number>(0);
    const [dataCart, setDataCart] = useState<IOrderItem[]>([]);
    const [orderActiveTabKey, setOrderActiveTabKey] = useState<string>('');
    const [itemTabs, setItemTabs] = useState<TabsProps['items']>([]);

    if (!getAdminAccountInfo()) {
        window.location.href = '/admin-account';
    }

    useEffect(() => {
        if (error) {
            showNotification("error", {
                message: error?.message,
                description: error?.response?.data?.message || "Error fetching orders pending",
            });
        }
    }, [error]);

    useEffect(() => {
        const result = data?.data;
        if (!isLoading && result) {
            const newTabsItems = result?.map((item: IOrder) => {
                return {
                    label: item.orderTrackingNumber,
                    children: <ContentTabPanelSale />,
                    key: item.id.toString(),
                    closable: false,
                }
            });

            if (newTabsItems?.length !== itemTabs?.length) {
                setItemTabs(newTabsItems);
                if (newTabsItems.length > 0 && orderActiveTabKey !== newTabsItems[0].key) {
                    setOrderActiveTabKey(newTabsItems[0].key);
                    setTotalQuantityCart(calculateCartTotalQuantity(dataCart));
                    setTotalQuantityCart(calculateCartOriginAmount(dataCart));
                    setOrderCreateOrUpdate((prevValue) => {
                        return {
                            ...prevValue,
                            id: Number(newTabsItems[0].key),
                            orderTrackingNumber: newTabsItems[0].label
                        }
                    });
                }
                return;
            }

            const keysChanged = newTabsItems.some((newItem: { key: string | undefined; }, index: number) => {
                return newItem?.key !== itemTabs?.[index]?.key;
            });

            if (keysChanged) setItemTabs(newTabsItems);

            if (newTabsItems.length > 0 && newTabsItems[0].key !== orderActiveTabKey) {
                setOrderActiveTabKey(newTabsItems[0].key);
                setTotalQuantityCart(calculateCartTotalQuantity(dataCart));
                setTotalQuantityCart(calculateCartOriginAmount(dataCart));
                setOrderCreateOrUpdate((prevValue) => {
                    return {
                        ...prevValue,
                        id: Number(newTabsItems[0].key),
                        orderTrackingNumber: newTabsItems[0].label,
                    }
                });
            }
        }
    }, [data?.data]);

    /**
     * xử lý thêm sản phẩm vào giỏ
     */
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
                let response = await handleCreateOrderItems(Number(orderActiveTabKey), newOrderItemsCreateOrUpdate)
                if (response) {
                    productVariantSelected.forEach((selectedProduct) => {
                        const orderItemId = response[selectedProduct.id];
                        if (orderItemId && !cartMap.has(selectedProduct.id)) {
                            cartMap.set(selectedProduct.id, {
                                id: orderItemId,
                                orderId: Number(orderActiveTabKey),
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
                    { revalidate: true }
                );
            }

            // console.log("new cart", Array.from(cartMap.values()))
            setDataCart([...Array.from(cartMap.values())]);

            await mutate((key: any) => typeof key === 'string' && key.startsWith(`${URL_API_ORDER_ITEM.get(Number(orderActiveTabKey))}`),
                undefined,
                { revalidate: true }
            );
        } catch (error: any) {
            // Rollback giỏ hàng về trạng thái trước khi thay đổi
            setDataCart([...Array.from(cartMapBackup.values())]);
            showMessage("error", error.message || "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!");
        }
    }

    // chọn tab hóa đơn chờ khác
    const onChange = (newActiveKey: string) => {
        console.log(orderActiveTabKey)
        setOrderActiveTabKey(newActiveKey);
        setTotalQuantityCart(calculateCartTotalQuantity(dataCart));
        setOrderCreateOrUpdate((prevValue) => {
            const currentTab = itemTabs?.find((item) => item.key === newActiveKey);

            const orderTrackingNumber = currentTab ? currentTab.label?.toString() : undefined;

            return {
                ...prevValue,
                id: Number(newActiveKey),
                orderTrackingNumber: orderTrackingNumber,
                totalAmount: calculateCartOriginAmount(dataCart)
            }
        });
    };

    // tạo tab và tạo luôn hóa đơn chờ
    const add = async () => {
        await handleCreateOrder(defaultOrderCreateOrUpdate)
            .then((result) => {
                const newActiveKey = `${result.id}`;
                const newPanes = [...itemTabs ?? []];
                newPanes.push({ label: result.orderTrackingNumber, children: <ContentTabPanelSale />, key: newActiveKey, closable: false });
                setItemTabs(newPanes);
                console.log(result.id)
                setOrderActiveTabKey(newActiveKey);
                setOrderCreateOrUpdate((prevValue) => {
                    return {
                        ...prevValue,
                        id: result.id,
                        orderTrackingNumber: result.orderTrackingNumber
                    }
                });
            })
            .catch(() => {
                showMessage("error", "Tạo hóa đơn thất bại.");
            });
        await mutateOrderPending();
    };

    // đóng tab
    const remove = (targetKey: TargetKey) => {
        let newActiveKey = orderActiveTabKey;
        let lastIndex = -1;
        itemTabs?.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = itemTabs?.filter((item) => item.key !== targetKey);
        if (newPanes?.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setItemTabs(newPanes);
        setOrderActiveTabKey(newActiveKey);
        setOrderCreateOrUpdate((prevValue) => ({ ...prevValue, id: Number(newActiveKey) }));
    };

    const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    return (
        <>
            {getAdminAccountInfo() ? (
                <>
                    <Layout style={{ background: colorBgContainer }}>
                        <HandleSale.Provider
                            value={{
                                totalQuantityCart,
                                setTotalQuantityCart,
                                totalAmountCart,
                                setTotalAmountCart,
                                orderCreateOrUpdate,
                                setOrderCreateOrUpdate,
                                orderActiveTabKey,
                                dataCart,
                                setDataCart,
                                handleAddOrderItemCart,
                                mutateOrderPending
                            }}
                        >
                            <Content style={{ background: colorBgContainer }}>
                                <Spin size="default" spinning={loading}>
                                    <Tabs
                                        type="editable-card"
                                        onChange={onChange}
                                        activeKey={orderActiveTabKey}
                                        onEdit={onEdit}
                                        tabBarExtraContent={OperationsSlot}
                                        tabBarStyle={tabBarStyle}
                                        items={itemTabs}
                                    />
                                </Spin>
                            </Content>
                        </HandleSale.Provider>
                    </Layout>
                </>
            ) : (<AdminLoader />)}
        </>
    );
}
export default SaleComponent;
