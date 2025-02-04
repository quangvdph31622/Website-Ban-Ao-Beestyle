'use client';

import React, { useEffect, useState } from 'react';
import CartTable from "@/components/User/Cart/CartTable";
import TotalAmount from "@/components/User/Cart/OrderSummary";
import { CART_KEY, checkShoppingCartData, ICartItem, updateCartQuantity, useShoppingCart } from "@/services/user/ShoppingCartService";
import { Typography } from 'antd';
import BreadcrumbSection from '@/components/Breadcrumb/BreadCrumb';
import Image from 'next/image';
import Link from 'next/link';
import { getAccountInfo } from '@/utils/AppUtil';

const { Title, Paragraph } = Typography;

const ShoppingCart = () => {
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

    const updateCartItems = (newCartItems: ICartItem[], index: number) => {
        const cartId = newCartItems[index] && newCartItems[index].id;
        const quantity = newCartItems[index] && newCartItems[index].quantity;
        setCartItems(newCartItems);

        if (getAccountInfo()) {
            updateCartQuantity({ id: cartId, quantity: quantity });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(newCartItems));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const breadcrumbItems = [
        { title: 'Trang chủ', path: '/' },
        { title: 'Giỏ hàng' },
    ];

    return (
        <>
            <BreadcrumbSection items={breadcrumbItems} />
            {cartItems && cartItems.length > 0 ? (
                <>
                    <div
                        className="container bg-white mt-5"
                        style={{
                            padding: 5,
                            borderRadius: 5
                        }}
                    >
                        <Title level={2} className="font-bold ms-4 mt-3">Giỏ hàng</Title>
                    </div>
                    <div className="container max-w-5xl mx-auto py-2 ps-0 pe-4 d-flex">
                        <div className="col-lg-8 me-4">
                            <CartTable cartItems={cartItems} updateCartItems={updateCartItems} />
                        </div>
                        <div className="col-lg-4">
                            <TotalAmount cartItems={cartItems} />
                        </div>
                    </div>
                </>
            ) : (
                <div className='flex flex-col items-center my-5'>
                    <Title level={2} className="font-bold mt-4">Giỏ hàng</Title>
                    <Paragraph className='fs-6'>Không có sản phẩm trong giỏ hàng.</Paragraph>
                    <Image
                        src="/cart-empty.svg"
                        alt="Empty"
                        width={280}
                        height={280}
                        unoptimized
                    />
                    <Link
                        href={"/product"}
                        className='btn no-underline text-white bg-black
                                   hover:!bg-orange-400 px-5 py-2 mt-2 mb-4'
                    >
                        Mua sắm ngay
                    </Link>
                </div>
            )}
        </>
    );
};

export default ShoppingCart;
