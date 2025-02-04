import React, { useEffect, useState } from 'react';
import { Drawer, Button, Empty, Popconfirm } from 'antd';
import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from './css/cartdrawer.module.css';
import Image from "next/image";
import { CART_KEY, checkShoppingCartData, ICartItem, removeItemFromCart, updateCartQuantity, useShoppingCart } from "@/services/user/ShoppingCartService";
import QuantityControl from "@/components/User/Cart/Properties/QuantityControl";
import ProgressShipping from './Properties/ProgressShipping';
import { FREE_SHIPPING_THRESHOLD } from '@/constants/AppConstants';
import { calculateUserCartTotalAmount, getAccountInfo } from '@/utils/AppUtil';

interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
    const { cartData, isLoading, error } = useShoppingCart();
    const [cartItems, setCartItems] = useState(cartData);

    useEffect(() => {
        if (!getAccountInfo()) {
            // checkShoppingCartData();
            const handleCartUpdate = () => {
                setCartItems(JSON.parse(localStorage.getItem(CART_KEY) || '[]'));
            };
            window.addEventListener('cartUpdated', handleCartUpdate);

            return () => {
                window.removeEventListener('cartUpdated', handleCartUpdate);
            };
        }
        setCartItems(cartData);
    }, [cartData]);


    const condition = FREE_SHIPPING_THRESHOLD;
    const totalAmount = calculateUserCartTotalAmount(cartItems);

    const handleQuantityChange = (index: number, newQuantity: number) => {
        const newCartItems = [...cartItems];
        const cartId = newCartItems[index] && newCartItems[index].id;
        newCartItems[index].quantity = newQuantity;
        newCartItems[index].totalPrice = newQuantity * newCartItems[index].discountedPrice;
        setCartItems(newCartItems);
        if (getAccountInfo()) {
            updateCartQuantity({ id: cartId, quantity: newQuantity });
        }
        localStorage.setItem(CART_KEY, JSON.stringify(newCartItems));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleRemoveCartItem = (params: { id: number, cartCode: string }) => {
        removeItemFromCart({ id: params.id, cartCode: params.cartCode });
    }

    return (
        <Drawer
            title={
                <>
                    <div className={styles.cartHeader}>
                        <h3 className={styles.cartTitle}>Giỏ hàng</h3>
                        <Button type="text" icon={<CloseOutlined style={{ fontSize: 20 }} />} onClick={onClose} />
                    </div>
                    <div className={cartItems && cartItems.length ? styles.shippingProgress : 'd-none'}>
                        <ProgressShipping totalAmount={totalAmount} condition={condition} />
                    </div>
                </>
            }
            placement="right"
            onClose={onClose}
            open={open}
            width={500}
            closable={false}
            style={{
                maxHeight: cartItems && cartItems.length > 2 ? 'calc(100vh - 140px)' : ''
            }}
        >
            {cartItems && cartItems.length ? cartItems.map((
                item: ICartItem, index: number) => (
                <div className={styles.cartItem} key={index}>
                    <Link
                        href={`/product/${item.productId}/variant`}
                        onClick={onClose}
                        className='flex items-center'
                    >
                        <Image
                            width={100}
                            height={100}
                            src={item.imageUrl}
                            alt={item.productName}
                            className={styles.itemImage}
                        />
                    </Link>

                    <div className={styles.itemInfo}>
                        <Link
                            href={`/product/${item.productId}/variant`}
                            className="no-underline"
                            onClick={onClose}
                        >
                            <span className={styles.itemTitle + ' text-black'}>{item.productName}</span>
                        </Link>
                        <p className={styles.itemVariant}>{item.colorName} / {item.sizeName}</p>
                        <div className={styles.quantityControl}>
                            <QuantityControl
                                quantity={item.quantity}
                                quantityInStock={item.quantityInStock}
                                onIncrement={() => handleQuantityChange(index, item.quantity + 1)}
                                onDecrement={() => handleQuantityChange(index, Math.max(1, item.quantity - 1))}
                            />
                        </div>
                    </div>

                    <div>
                        <Popconfirm
                            title="Xoá sản phẩm"
                            description="Bạn chắc chắn muốn xoá sản phẩm này?"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            placement="leftTop"
                            okText="Xoá"
                            cancelText="Không"
                            onConfirm={() => handleRemoveCartItem({ id: item.id, cartCode: item.cartCode })}
                        >
                            <Button
                                type="text"
                                icon={<CloseOutlined />}
                                className="ml-5"
                            />
                        </Popconfirm>
                        <div className="d-flex flex-column align-items-center mt-4">
                            <span className={styles.itemPrice + ' mt-7'}>
                                {item && item.salePrice.toLocaleString()}₫
                            </span>
                            {/* <span
                                className={item.salePrice > item.discountedPrice
                                    ? 'd-none' : styles.salePrice
                                }
                            >
                                {item && item.salePrice.toLocaleString()}₫
                            </span> */}
                        </div>
                    </div>
                </div>
            )
            ) : (
                <>
                    <Empty
                        image="/cart_banner_image.png"
                        style={{ marginTop: 15 }}
                        description={
                            <span
                                className="empty-description fs-5 text-black">Chưa có sản phẩm trong giỏ hàng...</span>
                        }
                        imageStyle={{
                            width: '400px',
                            height: 'auto',
                            display: 'block',
                            margin: '0 auto'
                        }}
                    />
                </>
            )}

            <div className={styles.cartFooter}>
                <div className={cartItems && cartItems.length ? '' : 'd-none'}>
                    <div className={styles.totalAmount}>
                        <span className={styles.totalLabel}>TỔNG TIỀN:</span>
                        <span className={styles.totalValue}>{totalAmount.toLocaleString()}₫</span>
                    </div>
                    <Link href={"/checkout"}
                        className={styles.checkoutButton + ' btn text-white'}
                        onClick={onClose}
                    >
                        THANH TOÁN
                    </Link>
                </div>

                <div className={styles.footerLinks}>
                    {cartItems && cartItems.length ?
                        (<Link
                            href={"/cart"}
                            className={styles.footerLink} onClick={onClose}>Xem giỏ hàng</Link>) :
                        (<Link href="/" className={styles.footerLink} onClick={onClose}>Trở về trang chủ</Link>)
                    }
                    <Link href={"/product"} className={styles.footerLink} onClick={onClose}>
                        Khuyến mãi dành cho bạn
                    </Link>
                </div>
            </div>
        </Drawer>
    );
}
