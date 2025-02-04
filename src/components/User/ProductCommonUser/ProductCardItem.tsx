"use client";
import React, { useState } from "react";
import ProductQuickLookupModal from "./ProductQuickLookupModal";
import { Badge, Button, Card, Flex, Image, Tooltip, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { FORMAT_NUMBER_WITH_COMMAS } from "@/constants/AppConstants";
import ColorButton from "@/components/Button/ColorButton";
import { LuShoppingBag } from "react-icons/lu";
import { IProduct } from "@/types/IProduct";
import Link from "next/link";

const { Text } = Typography;

interface IProps {
    product: IProduct;
}

const ProductCardItem: React.FC<IProps> = (props) => {
    const { product } = props;
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    const handleOpenModal = (product: IProduct) => {
        setSelectedProduct(product);
        setIsOpenModal(true);
    };

    const handleCloseModal = () => {
        setIsOpenModal(false);
        setSelectedProduct(null);
    };

    return (
        <>
            {/*<Badge.Ribbon*/}
            {/*    text="Test"*/}
            {/*    color="red"*/}
            {/*>*/}
                <Card
                    hoverable
                    styles={{ body: { padding: 0, overflow: 'hidden' } }}
                    bordered={false}
                    style={{ borderRadius: 0 }}
                >
                    <Flex justify="center">
                        <Link
                            href={`/product/${product.id}/variant`}
                            passHref
                        >
                            <Image
                                loading="lazy"
                                alt={product?.imageUrl}
                                src={product?.imageUrl}
                                style={{ width: "100%", height: "auto", objectFit: "cover", aspectRatio: "3/4" }}
                                preview={{
                                    mask: (
                                        <>
                                            <Flex gap={10}>
                                                <ColorButton
                                                    style={{ borderRadius: 4, padding: "0px 30px" }}
                                                    size="large"
                                                    type="primary"
                                                    bgColor="#F7941D"
                                                    icon={<LuShoppingBag />}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleOpenModal(product);
                                                    }}
                                                >
                                                    Thêm vào giỏ
                                                </ColorButton>
                                                <Tooltip
                                                    title={<span style={{ fontSize: 12, padding: 0 }}>Xem nhanh</span>}>
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
                        </Link>
                    </Flex>

                    <div className="flex flex-col flex-grow justify-between gap-2 px-2.5 py-1.5">
                        <Typography.Paragraph style={{ minHeight: 45, fontSize: 15, margin: 0 }} ellipsis={{ rows: 2 }}>
                            <Link
                                href={`/product/${product.id}/variant`}
                                className="text-black no-underline"
                                passHref
                            >
                                {product?.productName}
                            </Link>
                        </Typography.Paragraph>

                        <Text style={{ display: "block", marginBottom: 0, marginTop: "auto", fontSize: 17 }}
                            strong={true}>
                            {product.minSalePrice ? `${product.minSalePrice}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',') : 0}
                        </Text>
                    </div>
                </Card>
            {/*</Badge.Ribbon>*/}

            {isOpenModal && (
                <ProductQuickLookupModal
                    visible={isOpenModal}
                    onClose={handleCloseModal}
                    product={selectedProduct}
                />
            )}
        </>
    );
};

export default ProductCardItem;
