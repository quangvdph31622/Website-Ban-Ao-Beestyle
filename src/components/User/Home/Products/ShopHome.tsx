'use client';

import React, { useState } from "react";
import { Badge, Image, Tooltip } from "antd";
import Link from "next/link";
import { useOfferingProducts } from "@/services/user/ProductHomeService";
import ProductQuickLookupModal from "../../ProductCommonUser/ProductQuickLookupModal";
import { TiEye } from "react-icons/ti";

function ShopHome() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { products } = useOfferingProducts();

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
                    <section className="shop-home-list section pt-0">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-5 d-flex">
                                    <div className="col-10">
                                        <div className="shop-section-title">
                                            <h1>Ưu đãi</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {products.map((product, index: React.Key | number) => (
                                    <div className="col-lg-4 col-md-6 col-12" key={index}>
                                        <Badge.Ribbon
                                            text={`${product.discountValue}%`}
                                            className={product.discountValue > 0 ? '' : 'd-none'}
                                            color="red"
                                        >
                                            <div className="single-list">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 col-12">
                                                        {product.images
                                                            .filter((image: { isDefault: boolean; }) => image.isDefault)
                                                            .map((image: { id: React.Key | null | undefined; }, index: number) => {
                                                                if (!image) return null;
                                                                return (
                                                                    <React.Fragment key={image.id}>
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
                                                                            src={product.images.find((image: { isDefault: boolean; }) => image.isDefault)?.imageUrl}
                                                                            alt={`${product.name} image ${index + 1}`}
                                                                            loading="lazy"
                                                                            style={{ width: "100%", height: "auto", objectFit: "cover", aspectRatio: "3/4" }}
                                                                        />
                                                                    </React.Fragment>
                                                                )
                                                            })}
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-12 no-padding">
                                                        <div className="content">
                                                            <p className="title">
                                                                <Link href={`/product/${product.id}/variant`}
                                                                    className="link-no-decoration text-dark fs-6">{product.productName}</Link>
                                                            </p>
                                                            <p className="price with-discount">
                                                                {product.minDiscountedPrice.toLocaleString()} đ
                                                            </p>
                                                            <s
                                                                className={product.minSalePrice > product.minDiscountedPrice
                                                                    ? 'ms-2' : 'd-none'
                                                                }
                                                            >
                                                                {product.minSalePrice.toLocaleString()} đ
                                                            </s>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Badge.Ribbon>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
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

export default ShopHome;
