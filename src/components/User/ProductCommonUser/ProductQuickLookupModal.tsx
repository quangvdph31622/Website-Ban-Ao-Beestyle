'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Carousel, Tag, InputNumber, Image, message } from 'antd';
import { useProduct } from '@/services/user/SingleProductService';
import ColorPickers from '@/components/User/ShopSingle/Properties/ColorPickers';
import SizePickers from '@/components/User/ShopSingle/Properties/SizePickers';
import Link from 'next/link';
import { useRef } from 'react';
import { addToCart } from '@/services/user/ShoppingCartService';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import styles from "./css/modal.module.css";
import { IProduct } from '@/types/IProduct';

interface IProps {
    visible: boolean;
    onClose: () => void;
    product: IProduct | null;
}

const ProductQuickLookupModal: React.FC<IProps> = ({ visible, onClose, product }) => {
    const carouselRef = useRef<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const productId: number = product && product.id;

    const { data: productData, error: productError } = useProduct(productId, selectedColor, selectedSize);

    useEffect(() => {
        setQuantity(1);
        setSelectedColor(null);
        setSelectedSize(null);
        setCurrentSlide(0);

        if (productError) console.log(productError);
    }, [productId, visible, productError]);

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        setSelectedSize(null);
    };

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
    };

    const handleDecrement = () => setQuantity((prev) => Math.max(prev - 1, 1));

    const handleIncrement = () => {
        const maxQuantity = Number(productData?.quantityInStock);
        setQuantity((prev) => Math.min(prev + 1, isNaN(maxQuantity) ? Infinity : maxQuantity));
    };

    const handleAddToCart = async (product: any, quantity: number) => {
        if (selectedColor && selectedSize && product) {
            const imageUrl = product.images.find((image: { isDefault: boolean; }) => image.isDefault).imageUrl;
            if (quantity > 0 && product.quantityInStock > 0) {
                await addToCart(product, quantity, imageUrl);
            } else {
                message.warning(
                    {
                        content: `Sản phẩm ${productData?.productName} đã hết hàng!`,
                        duration: 5,
                    }
                );
            }
        }
        else return;
    }

    const goToSlide = (index: number) => {
        if (isSliding) return;
        setIsSliding(true);

        carouselRef.current?.goTo(index);
        setCurrentSlide(index);

        setTimeout(() => setIsSliding(false), 500);
    };

    const slides = productData?.images
        ? productData?.images.map((image: any, index: number) => (
            <div key={index} className="flex justify-center">
                <Image
                    loading="lazy"
                    style={{ width: "100%", height: "auto", objectFit: "cover", aspectRatio: "3/4" }}
                    src={image.imageUrl}
                    alt={product?.productName}
                    preview={false}
                />
            </div>
        ))
        : [
            <div key="0" className="flex justify-center">
                <Image
                    loading="eager"
                    style={{ width: "350px", height: "100%", objectFit: "cover", aspectRatio: "3/4" }}
                    src="/no-img.png"
                    alt={product?.productName}
                    preview={false}
                />
            </div>,
        ];

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={1000}
            className={` ${styles.customModal}`}
            closable
        >
            <div className="flex">
                <div className="flex flex-col gap-2 me-1">
                    {productData?.images &&
                        productData?.images.map((image: any, index: number) => (
                            <div
                                key={index}
                                className={`w-16 h-[84px] flex-shrink-0 cursor-pointer border-2 me-2
                                        ${currentSlide === index ? 'border-orange-400' : 'border-transparent'}`}
                                onClick={() => goToSlide(index)}
                            >
                                <Image
                                    width={60}
                                    height={"auto"}
                                    src={image.imageUrl}
                                    alt={product.productName}
                                    preview={false}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                </div>
                <div className='w-1/2 pe-2'>
                    <Carousel
                        ref={carouselRef}
                        autoplay={false}
                        infinite={false}
                        dots={false}
                        style={{ textAlign: 'center' }}
                        afterChange={(index) => setCurrentSlide(index)}
                        initialSlide={currentSlide}
                    >
                        {slides}
                    </Carousel>
                    <div className="text-center mt-2">
                        <Link href={`/product/${product?.id}/variant`} className="!text-blue-500">
                            Xem chi tiết sản phẩm
                        </Link>
                    </div>
                </div>
                <div className="w-1/2 pl-8 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-2">{product?.productName || 'No product data'}</h2>
                        <p className="mb-2">
                            <span className="font-semibold">SKU:</span> {productData?.sku} | {' '}
                            <span className="font-semibold">Tình trạng:</span>{' '}
                            {productData?.quantityInStock > 0 ? (
                                <Tag color="green">Còn hàng</Tag>
                            ) : (
                                <Tag color="red">Hết hàng</Tag>
                            )}
                        </p>
                        <p className="mb-4">
                            <span className="font-semibold">Thương hiệu:</span>{' '}
                            <span className="text-blue-500">{product?.brandName}</span>
                        </p>
                        <div className="flex items-center mb-4">
                            <span className="text-orange-400 text-2xl font-bold">
                                {productData?.discountPrice?.toLocaleString()} đ
                            </span>
                            <span
                                className={productData?.salePrice > productData?.discountPrice
                                    ? 'text-gray-500 text-lg fs-6 line-through ms-2' : 'd-none'
                                }
                            >
                                {productData?.salePrice?.toLocaleString()} đ
                            </span>
                            <Tag
                                color={'pink'}
                                key={'discount'}
                                bordered={false}
                                className={productData?.salePrice > productData?.discountPrice
                                    ? 'ms-2 rounded-3xl' : 'd-none'
                                }
                            >
                                <span className="text-red-500 font-bold">
                                    -{productData?.discountValue}%
                                </span>
                            </Tag>
                        </div>

                        <ColorPickers
                            productId={productId}
                            selectedColor={selectedColor}
                            onColorSelect={handleColorSelect}
                            style={{ maxWidth: '300px', overflowX: 'auto', whiteSpace: 'nowrap' }}
                        />

                        <SizePickers
                            productId={productId}
                            colorCode={selectedColor}
                            selectedSize={selectedSize}
                            onSizeSelect={handleSizeSelect}
                        />
                        <div className="flex items-center mt-8">
                            <p className="text-black font-semibold mr-5 mb-0">Số lượng</p>
                            <div className="flex items-center">
                                <Button
                                    onClick={handleDecrement}
                                    className="!bg-gray-200 hover:!bg-gray-300 !text-black !font-bold relative z-10
                                               !border-none !rounded-none !w-10 !h-10 flex items-center justify-center"
                                    icon={<MinusOutlined />}
                                    disabled={quantity <= 1}
                                />

                                <InputNumber
                                    min={1}
                                    value={quantity}
                                    style={{ lineHeight: '40px', textAlignLast: 'center' }}
                                    className="!text-black !font-semibold !border-0 !w-16 !h-10 custom-input"
                                    readOnly
                                    controls={false}
                                />

                                <Button
                                    onClick={handleIncrement}
                                    className="!bg-gray-200 hover:!bg-gray-300 !text-black !font-bold relative z-10
                                               !border-none !rounded-none !w-10 !h-10 flex items-center justify-center"
                                    icon={<PlusOutlined />}
                                    disabled={quantity >= productData?.quantityInStock}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonCustom}>
                        <Button
                            type="primary"
                            block
                            size="large"
                            className="bg-black text-white hover:!bg-orange-400"
                            onClick={() => handleAddToCart(productData, quantity)}
                        >
                            Thêm vào giỏ
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProductQuickLookupModal;
