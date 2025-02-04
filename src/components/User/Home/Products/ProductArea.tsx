'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Badge, Button, Flex, Image, Tooltip, Row, Col, Card, Typography } from "antd";
import ProductQuickLookupModal from "@/components/User/ProductCommonUser/ProductQuickLookupModal";
import { useProducts } from "@/services/user/ProductHomeService";
import ColorButton from "@/components/Button/ColorButton";
import { LuShoppingBag } from "react-icons/lu";
import { EyeOutlined } from "@ant-design/icons";

function ProductArea() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [query, setQuery] = useState<string>('');

    const { products } = useProducts(query);

    const handleOpenModal = (product: any) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    const handleSetParams = (param: string, event: any) => {
        event.preventDefault();
        if (
            typeof param === 'string' && param.includes('0') ||
            param.includes('1') || param.includes('2') ||
            param.includes('3') || param.includes('4')
        ) {
            setQuery(param);
        }
    }

    return (
        <>
            {products && Array.isArray(products) && products.length > 0 ? (
                <>
                    <div className="product-area section">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="section-title">
                                        <h2>Sản Phẩm Nổi Bật</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="product-info">
                                        <div className="nav-main">
                                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                                <li className="nav-item">
                                                    <Link
                                                        href="#"
                                                        className={`nav-link w-[85px] ${query === '0' ? 'active' : ''}`}
                                                        onClick={(e) => handleSetParams('0', e)}
                                                        role="tab">
                                                        Nam
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link
                                                        href="#"
                                                        className={`nav-link w-[85px] ${query === '1' ? 'active' : ''}`}
                                                        onClick={(e) => handleSetParams('1', e)}
                                                        role="tab"
                                                    >
                                                        Nữ
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link
                                                        href="#"
                                                        className={`nav-link w-[85px] ${query === '2' ? 'active' : ''}`}
                                                        onClick={(e) => handleSetParams('2', e)}
                                                        role="tab"
                                                    >
                                                        Unisex
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link
                                                        href="#"
                                                        className={`nav-link w-[85px] px-1 ${query === '3' ? 'active' : ''}`}
                                                        onClick={(e) => handleSetParams('3', e)}
                                                        role="tab"
                                                    >
                                                        Phổ biến
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link
                                                        href="#"
                                                        className={`nav-link w-[85px] ${query === '4' ? 'active' : ''}`}
                                                        onClick={(e) => handleSetParams('4', e)}
                                                        role="tab"
                                                    >
                                                        Ưu đãi
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mt-4">
                                            <div className="tab-pane fade show active" id="man" role="tabpanel">
                                                <Row gutter={[16, 16]} >
                                                    {products.map((product) => (
                                                        <Col key={product.id} xs={24} sm={12} md={12} lg={8} xl={6}>
                                                            <Badge.Ribbon
                                                                text={`${product.discountValue}%`}
                                                                className={product.discountValue > 0 ? '' : 'd-none'}
                                                                color="red"
                                                            >
                                                                <Card
                                                                    hoverable
                                                                    className="product-card flex flex-col justify-between"
                                                                    cover={
                                                                        <div className="product-img-container">
                                                                            <Link
                                                                                href={`/product/${product.id}/variant`}
                                                                                onClick={() => {
                                                                                    localStorage.setItem('productImages', JSON.stringify(product.images));
                                                                                }}
                                                                            >
                                                                                {product.images
                                                                                    .filter((image: { isDefault: boolean; }) => image.isDefault)
                                                                                    .map((image: { id: React.Key | null | undefined; }, index: number) => {
                                                                                        if (!image) return null;
                                                                                        return (
                                                                                            <Image
                                                                                                key={image.id}
                                                                                                loading="lazy"
                                                                                                src={product.images.find((image: { isDefault: boolean; }) => image.isDefault)?.imageUrl}
                                                                                                alt={`${product.name} image ${index + 1}`}
                                                                                                style={{ width: "100vh", height: "410px", objectFit: "cover" }}
                                                                                                className="default-img"
                                                                                                preview={{
                                                                                                    mask: (
                                                                                                        <>
                                                                                                            <Flex gap={10}>
                                                                                                                <ColorButton
                                                                                                                    style={{ borderRadius: 4, padding: "0px 30px" }}
                                                                                                                    size="large"
                                                                                                                    type="primary"
                                                                                                                    bgColor="#F7941D"
                                                                                                                    icon={<LuShoppingBag style={{}} />}
                                                                                                                    onClick={(e) => {
                                                                                                                        e.preventDefault();
                                                                                                                        handleOpenModal(product);
                                                                                                                    }}
                                                                                                                >
                                                                                                                    Thêm vào giỏ
                                                                                                                </ColorButton>
                                                                                                                <Tooltip
                                                                                                                    title={<span style={{ fontSize: 12, padding: 0 }}>Xem nhanh</span>}
                                                                                                                >
                                                                                                                    <Button
                                                                                                                        style={{ borderRadius: 4 }}
                                                                                                                        size="large"
                                                                                                                        color="default"
                                                                                                                        variant="solid"
                                                                                                                        icon={<EyeOutlined />}
                                                                                                                        onClick={(e) => {
                                                                                                                            e.preventDefault();
                                                                                                                            handleOpenModal(product);
                                                                                                                        }}
                                                                                                                    />
                                                                                                                </Tooltip>
                                                                                                            </Flex>
                                                                                                        </>
                                                                                                    ),
                                                                                                    maskClassName: "custom-mask-img",
                                                                                                    visible: false,
                                                                                                    destroyOnClose: true,
                                                                                                }}
                                                                                            />
                                                                                        );
                                                                                    })}
                                                                            </Link>
                                                                        </div>
                                                                    }
                                                                >
                                                                    <Link
                                                                        href={`/product/${product.id}/variant`}
                                                                        className="no-underline"
                                                                        passHref
                                                                    >
                                                                        <Typography.Paragraph
                                                                            style={{ minHeight: 45, fontSize: 16, margin: 0 }}
                                                                            ellipsis={{ rows: 2 }}
                                                                            className="h-12 fw-semibold flex justify-center items-start"
                                                                        >
                                                                            {product?.productName}
                                                                        </Typography.Paragraph>
                                                                    </Link>

                                                                    <div className="product-price">
                                                                        <span
                                                                            className={product.minSalePrice > product.minDiscountedPrice
                                                                                ? 'old-price' : 'd-none'
                                                                            }
                                                                        >
                                                                            {product.minSalePrice.toLocaleString()} đ
                                                                        </span>
                                                                        <span
                                                                            className="current-price ml-2"
                                                                        >
                                                                            {product.minDiscountedPrice.toLocaleString()} đ
                                                                        </span>
                                                                    </div>
                                                                </Card>
                                                            </Badge.Ribbon>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isModalVisible && (
                        <ProductQuickLookupModal
                            visible={isModalVisible}
                            onClose={handleCloseModal}
                            product={selectedProduct}
                        />
                    )}
                </>
            ) : (<div className="p-4"></div>)}
        </>
    )
}

export default ProductArea;
