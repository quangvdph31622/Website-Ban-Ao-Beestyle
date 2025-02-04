import React from "react";
import { Button, Card, Image, Typography } from "antd";
import QuantityControl from "@/components/User/Cart/Properties/QuantityControl";
import { CloseOutlined, FireOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import ProgressShipping from "./Properties/ProgressShipping";
import { ICartItem, removeItemFromCart } from "@/services/user/ShoppingCartService";
import useAppNotifications from "@/hooks/useAppNotifications";
import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD } from "@/constants/AppConstants";
import { calculateUserCartTotalAmount } from "@/utils/AppUtil";

const { Title, Text } = Typography;

const CartTable = ({ cartItems, updateCartItems }: {
    cartItems: ICartItem[];
    updateCartItems: (newCartItems: ICartItem[], index: number) => void
}) => {
    const condition = FREE_SHIPPING_THRESHOLD;
    const totalAmount = calculateUserCartTotalAmount(cartItems);
    const promotionPrice = 0;
    const { showNotification, showModal } = useAppNotifications();

    const handleQuantityChange = (index: number, operation: 'increment' | 'decrement') => {
        const newCartItems = [...cartItems];
        const item: ICartItem = newCartItems[index];

        if (operation === 'increment') {
            item.quantity = Math.min(item.quantity + 1, item.quantityInStock);
        } else if (operation === 'decrement') {
            item.quantity = Math.max(item.quantity - 1, 1);
        }

        item.totalPrice = item.quantity * item.discountedPrice;
        newCartItems[index] = item;

        updateCartItems(newCartItems, index);
    };

    const handleRemoveCartItem = (params: { id: number, cartCode: string }) => {
        showModal('confirm', {
            title: 'Xoá sản phẩm',
            content: 'Bạn chắc chắn muốn xoá sản phẩm này?',
            icon: (<QuestionCircleOutlined style={{ color: 'red' }} />),
            centered: true,
            okText: 'Xoá',
            cancelText: 'Không',
            onOk() {
                removeItemFromCart({ id: params.id, cartCode: params.cartCode });
                showNotification('success', {
                    message: (<span className="fw-semibold fs-6">Đã gỡ sản phẩm khỏi giỏ hảng</span>),
                    placement: 'topRight',
                    duration: 3
                })
            }
        })
    }

    return (
        <Card className="rounded-lg shadow-md mb-4">
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <ProgressShipping totalAmount={totalAmount} condition={condition} />
            </div>

            <div
                className={promotionPrice && promotionPrice > 0
                    ? "bg-gray-100 p-3 rounded-lg mb-4 flex items-center" : "d-none"
                }
            >
                <FireOutlined className="text-red-500 text-xl mr-2" />
                <p className="m-0">
                    Khuyến mại trong giỏ hàng của bạn
                    <span className="text-red-500 font-bold ms-1">
                        {promotionPrice.toLocaleString()} đ
                    </span>
                </p>
            </div>

            <div style={{ maxHeight: '515px', overflowY: 'auto' }}>
                {cartItems.map((item: ICartItem, index: number) => (
                    <div key={index.toString()}>
                        <div className="float-end">
                            <Button
                                type="text"
                                onClick={() => handleRemoveCartItem({ id: item.id, cartCode: item.cartCode })}
                                icon={<CloseOutlined />}
                                className="ml-5"
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <Link href={`/product/${item.productId}/variant`} passHref>
                                <Image
                                    width={160}
                                    height={"auto"}
                                    src={item.imageUrl}
                                    alt={item.productName}
                                    className="rounded-lg"
                                    preview={false}
                                />
                            </Link>
                            <div className="ms-4">
                                <Title level={4} style={{ fontWeight: 500 }}>
                                    <Link
                                        href={`/product/${item.productId}/variant`}
                                        passHref
                                        className="text-black hover:!text-orange-400"
                                    >
                                        {item.productName}
                                    </Link>
                                </Title>
                                <Text className="text-red-500 text-xl font-bold">
                                    {item.salePrice.toLocaleString()} đ
                                </Text>
                                {/* <div style={item.salePrice > item.discountedPrice ? {} : { visibility: 'hidden' }}>
                                    <p className="line-through text-gray-500">
                                        {item.salePrice.toLocaleString()} đ
                                    </p>
                                    <p className="text-red-500">
                                        <span
                                            style={{ color: "#333" }}
                                        >
                                            Đã tiết kiệm
                                        </span> -{(item.salePrice - item.discountedPrice).toLocaleString()} đ
                                    </p>
                                </div> */}
                                <div style={(item.salePrice * item.quantity) > item.salePrice ? {} : { visibility: 'hidden' }}>
                                    <p className="text-red-500 mt-4">
                                        <span
                                            style={{ color: "#333" }}
                                        >
                                            Tổng giá:
                                        </span> {(item.salePrice * item.quantity).toLocaleString()} đ
                                    </p>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p>{item.colorName} / {item.sizeName}</p>
                                    <div className="justify-self-end">
                                        <QuantityControl
                                            quantity={item.quantity}
                                            quantityInStock={item.quantityInStock}
                                            onIncrement={() => handleQuantityChange(index, 'increment')}
                                            onDecrement={() => handleQuantityChange(index, 'decrement')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
export default CartTable;
