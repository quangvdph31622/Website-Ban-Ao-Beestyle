import React, { useState } from 'react';
import Link from "next/link";
import { Button, Flex, InputNumber, message, Rate, Tag } from 'antd';
import { ProductVariant } from "@/services/user/SingleProductService";
import ColorPickers from "@/components/User/ShopSingle/Properties/ColorPickers";
import SizePickers from "@/components/User/ShopSingle/Properties/SizePickers";
import { addToCart } from "@/services/user/ShoppingCartService";
import { EyeOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import InfoSection from "@/components/User/ShopSingle/Properties/InfoSession";
import { useRouter } from 'next/navigation';

interface ProductDescriptionProps {
    product: ProductVariant | undefined;
    productId: string;
    selectedColor: string | undefined;
    selectedSize: string | undefined;
    onColorSelect: (color: string) => void;
    onSizeSelect: (size: string) => void;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
    product,
    productId,
    selectedColor,
    selectedSize,
    onColorSelect,
    onSizeSelect
}) => {
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    const handleDecrement = () => {
        setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => Math.min(prevQuantity + 1, 1000));
    };

    const handleAddToCart = async (product: any, quantity: number, redirect: boolean) => {
        if (selectedColor && selectedSize && product) {
            const imageUrl = product.images.find((image: { isDefault: boolean; }) => image.isDefault).imageUrl;
            if (quantity > 0 && product.quantityInStock > 0) {
                if (redirect) {
                    await addToCart(product, quantity, imageUrl);
                    router.push('/cart');
                }
                else await addToCart(product, quantity, imageUrl);
            } else {
                message.warning(
                    {
                        content: `Sản phẩm ${product?.productName} đã hết hàng!`,
                        duration: 5,
                    }
                );
            }
        }
        else return;
    }

    return (
        <div className="product-des">
            <div className="short">
                <h6 className="text-capitalize fw-bold mb-0">
                    {product && product.productName || 'Không có thông tin về sản phẩm'}
                </h6>
                <div className="rating-main" style={{ fontSize: '13px' }}>
                    <span className="pe-2" style={{ borderRight: '2px solid #EDF0F5' }}>
                        SKU: {product && product.sku || '?'}
                    </span>

                    <ul className="rating ps-5">
                        <li>
                            <div>
                                <Rate disabled defaultValue={5}
                                    style={{ marginLeft: -35, fontSize: 16, color: '#FCAF17' }} />
                                <span className="ps-2">
                                    <span className="fw-bold me-2">4.9</span>
                                    <span style={{ color: '#7a7a7a' }}>({Math.floor(Math.random() * 120) + 1})</span>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div className="ml-2" style={{ borderLeft: '2px solid #EDF0F5' }}>
                                <span className="ml-2">Thương hiệu: </span>
                                <span className="fw-bold">
                                    {product && product.brandName || '?'}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
                <p className="price px-3 py-4 m-0 flex items-center" style={{ backgroundColor: '#FAFAFA', borderRadius: '5px' }}>
                    <span className="discount text-center">
                        {product?.discountPrice ? `${product.discountPrice.toLocaleString()} đ` : '0 đ'}
                    </span>
                    <s
                        className={product && product.salePrice > product.discountPrice
                            ? "fw-medium fs-6" : "hidden"
                        }
                        style={{ color: '#838383' }}
                    >
                        {product?.salePrice.toLocaleString() + ' đ'}
                    </s>
                    <Tag
                        color={'pink'}
                        key={'discount'}
                        bordered={false}
                        className={product && product.salePrice > product.discountPrice
                            ? 'ms-2 rounded-3xl' : 'd-none'
                        }
                    >
                        <span className="!text-red-500 font-bold me-0">
                            -{product?.discountValue}%
                        </span>
                    </Tag>
                </p>
            </div>

            <div className="mt-4">
                <div className="flex items-center mb-4">
                    <EyeOutlined style={{ fontSize: 20 }} />
                    <span
                        className="ml-2"><b>{Math.floor(Math.random() * 50) + 1}</b> người đang xem sản phẩm này
                    </span>
                </div>

                <div className="mb-4">
                    {product && product.quantityInStock > 0 ? (
                        <span className="text-gray-800">
                            Chỉ còn <b>{product.quantityInStock}</b> sản phẩm trong kho!
                        </span>
                    ) : (
                        <span className="text-red-800">
                            Hết hàng!
                        </span>
                    )}
                </div>
            </div>

            <div className="d-flex flex-column">
                <div className="color">
                    <ColorPickers
                        productId={productId}
                        selectedColor={selectedColor}
                        onColorSelect={onColorSelect}
                    />
                </div>

                <div className="size">
                    <SizePickers
                        productId={productId}
                        colorCode={selectedColor}
                        selectedSize={selectedSize}
                        onSizeSelect={onSizeSelect}
                    />
                </div>
            </div>

            <div className="product-buy">
                <Flex align='end' className='mb-4'>
                    <div className="quantity">
                        <h6>Số lượng:</h6>
                        <div className="flex items-center mt-3">
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
                                disabled={quantity >= (product?.quantityInStock || 0)}
                            />
                        </div>
                    </div>
                    <div className="add-to-cart">
                        <Link
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product, quantity, false);
                            }}
                            className="btn"
                            style={{ margin: '0 0 0 20px', padding: '0 151px' }}
                        >
                            Thêm vào giỏ hàng
                        </Link>
                    </div>
                </Flex>
                <div className="add-to-cart">
                    <Link
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product, quantity, true);
                        }}
                        className="btn"
                        style={{ width: '635px' }}
                    >
                        Mua ngay
                    </Link>
                </div>

                <InfoSection />
            </div>
        </div>
    );
};

export default ProductDescription;
