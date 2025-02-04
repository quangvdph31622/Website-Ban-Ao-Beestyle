'use client';

import Link from "next/link";
import { Card, Tooltip, Image, Badge, Typography } from 'antd';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useState } from "react";
import ProductQuickLookupModal from "@/components/User/ProductCommonUser/ProductQuickLookupModal";
import { useSellingProducts } from "@/services/user/ProductHomeService";
import { TiEye } from 'react-icons/ti';
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const CustomPrevArrow = ({ onClick }: any) => (
    <div
        className="custom-arrow prev-arrow hover:!bg-black/80"
        onClick={onClick}
        style={{
            position: "absolute",
            left: "-15px",
            top: "40%",
            transform: "translateY(-50%)",
            backgroundColor: "#6B6E6C",
            padding: "5px",
            borderRadius: "50%",
            cursor: "pointer",
            zIndex: 2,
        }}
    >
        <LeftOutlined style={{ fontSize: 20, padding: 5, color: 'white' }} />
    </div>
);

const CustomNextArrow = ({ onClick }) => (
    <div
        className="custom-arrow next-arrow hover:!bg-black/80"
        onClick={onClick}
        style={{
            position: "absolute",
            right: "-15px",
            top: "40%",
            transform: "translateY(-50%)",
            backgroundColor: "#6B6E6C",
            padding: "5px",
            borderRadius: "50%",
            cursor: "pointer",
            zIndex: 2,
        }}
    >
        <RightOutlined style={{ fontSize: 20, padding: 5, color: 'white' }} />
    </div>
);

function MostPopularProduct() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    const { products } = useSellingProducts();

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: (isHovered && isHovered),
        prevArrow: (isHovered && (<CustomPrevArrow onClick={undefined} />)),
        nextArrow: (isHovered && (<CustomNextArrow onClick={undefined} />))
    };

    const handleOpenModal = (product: any) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    return (
        <>
            {products && Array.isArray(products) && products.length > 0 ? (
                <>
                    <div
                        className="product-area most-popular section pb-4"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="section-title">
                                        <h2>Top sản phẩm bán chạy</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <Slider {...settings}>
                                        {products.map((product) => (
                                            <div key={product.id}>
                                                <Card
                                                    className="product-card flex flex-col justify-between"
                                                    styles={{ body: { padding: '0 8px' } }}
                                                >
                                                    <Badge.Ribbon
                                                        text={`${product.discountValue}%`}
                                                        className={product.discountValue > 0 ? '' : 'd-none'}
                                                        color="red"
                                                    >
                                                        <div className="product-image-wrapper">
                                                            <Image
                                                                preview={{
                                                                    mask: (
                                                                        <div className="flex items-center justify-center h-full">
                                                                            <Tooltip
                                                                                title={
                                                                                    <span style={{ fontSize: 12, padding: 0 }}>
                                                                                        Xem nhanh
                                                                                    </span>
                                                                                }
                                                                                color="#F7941D"
                                                                            >
                                                                                <TiEye size={25} color="#fff"
                                                                                    className="hover:!text-orange-400"
                                                                                    onClick={() => handleOpenModal(product)}
                                                                                />
                                                                            </Tooltip>
                                                                        </div>
                                                                    ),
                                                                    maskClassName: 'flex items-center justify-center bg-black bg-opacity-50',
                                                                    visible: false,
                                                                }}
                                                                loading="lazy"
                                                                src={product.images.find((image: { isDefault: boolean; }) => image.isDefault)?.imageUrl}
                                                                alt={`${product.name}`}
                                                                style={{ width: "100vh", height: "410px", objectFit: "cover" }}
                                                                className="default-img"
                                                            />
                                                        </div>
                                                        <div className="product-content">
                                                            <Link
                                                                href={`/product/${product.id}/variant`}
                                                                className="no-underline"
                                                                passHref
                                                            >
                                                                <Typography.Paragraph
                                                                    style={{ minHeight: 45, fontSize: 16, margin: 0 }}
                                                                    ellipsis={{ rows: 2 }}
                                                                    className="h-12 fw-semibold mt-4"
                                                                >
                                                                    {product.productName}
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
                                                        </div>
                                                    </Badge.Ribbon>
                                                </Card>
                                            </div>
                                        ))}
                                    </Slider>
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
    );
}

export default MostPopularProduct;
