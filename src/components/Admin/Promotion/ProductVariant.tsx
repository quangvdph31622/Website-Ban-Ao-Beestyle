"use client";

import React, {memo, useEffect, useState, useMemo} from "react";
import {
    Modal,
    Row,
    Col,
    Table,
    Empty,
    Tag,
    Typography, Flex, Pagination, Button,
} from "antd";
import {getProductDetails} from "../../../services/ProductVariantService";
import {IProductVariant} from "../../../types/IProductVariant";
import useOptionColor from "@/components/Admin/Color/hooks/useOptionColor";
import useOptionSize from "@/components/Admin/Size/hooks/useOptionSize";

const {Text} = Typography;

interface IProps {
    isProductVariantOpen: boolean;
    setIsProductVariantOpen: (value: boolean) => void;
    productId: number;
    onSelectProductVariants: (selectedVariants: IProductVariant[]) => void;
    onProductSelect: (selectedDetails: IProductVariant[]) => void;
}

const ProductVariant: React.FC<IProps> = ({
                                              isProductVariantOpen,
                                              setIsProductVariantOpen,
                                              productId,
                                              onProductSelect,
                                          }) => {
    const [productDetails, setProductDetails] = useState<IProductVariant[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    // Fetch color and size options
    const {dataOptionColor, error: errorDataOptionColor, isLoading: isLoadingDataOptionColor}
        = useOptionColor(isProductVariantOpen);
    const colorMap = useMemo(() => new Map(dataOptionColor.map(item => [item.label, item.code])), [dataOptionColor]);

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) {
            setPageSize(pageSize);
        }
    };
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return productDetails.slice(start, end);
    }, [productDetails, currentPage, pageSize]);



    const handleCloseProductVariantModal = () => {
        setIsProductVariantOpen(false);
        // setProductDetails([]);
        setSelectedRowKeys([]);
    };

    useEffect(() => {
        if (isProductVariantOpen) {
            setSelectedRowKeys([]);
        }
    }, [isProductVariantOpen]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const detailsResponse = await getProductDetails(productId);
                const productDetails = Array.isArray(detailsResponse)
                    ? detailsResponse.map((item) => ({
                        id: item[4],
                        productVariantName: item[1],
                        brandName: item[2],
                        materialName: item[3],
                        quantityInStock: item[9],
                        sku: item[5],
                        colorName: item[6],
                        sizeName: item[7],
                        originalPrice: item[8],
                        promotionName: item[10],

                    }))
                    : [];
                setProductDetails(productDetails);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu chi tiết sản phẩm:", error);
            }
        };

        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    const handleOk = () => {
        const selectedVariants = productDetails.filter((variant) =>
            selectedRowKeys.includes(variant.id)
        );
        onProductSelect(selectedVariants);
        handleCloseProductVariantModal();
    };

    const detailColumns = [
        {title: "SKU", dataIndex: "sku", key: "sku"},
        {
            title: "Tên sản phẩm",
            key: "productVariantName",
            render: (record: IProductVariant) => {
                const colorName = record?.colorName || "_";
                const colorCode = colorMap.get(record?.colorName) || "";
                const sizeName = record?.sizeName ? record.sizeName : "_";
                return (
                    <span>
                        <Text>{record.productVariantName}</Text>
                        <Text type="secondary" style={{display: "flex", alignItems: "center"}}>
                            <span style={{marginInlineEnd: 4}}>
                                {`Màu: ${colorName}`}
                            </span>
                            {colorCode ? <Tag className="custom-tag" color={colorCode}/> : ""} |
                            {` Kích cỡ: ${sizeName}`}
                        </Text>
                    </span>
                );
            },
        },
        {
            title: "Đang áp dụng",
            dataIndex: "promotionName",
            key: "promotionName",
            render: (promotion: string) => (
                <Tag color={promotion ? "green" : "red"}>
                    {promotion || "Không có khuyến mãi"}
                </Tag>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: number[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    return (
        <Modal
            title="Chọn sản phẩm chi tiết"
            open={isProductVariantOpen}
            onCancel={handleCloseProductVariantModal}
            okButtonProps={{
                style: {background: "#00b96b"},
            }}
            width={1000}
            footer={
                <Flex align="center" justify="space-between">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalItems || productDetails.length}
                        onChange={handlePageChange}
                        showSizeChanger
                        onShowSizeChange={(current, size) => {
                            setPageSize(size);
                            setCurrentPage(1);
                        }}
                        pageSizeOptions={["10", "20", "50", "100"]}
                    />

                    <div>
                        <Button key="cancel" onClick={handleCloseProductVariantModal}>
                            Hủy
                        </Button>
                        <Button key="ok" type="primary" onClick={handleOk} style={{marginLeft: "10px"}}>
                            Chọn
                        </Button>
                    </div>
                </Flex>
            }
            styles={{
                body: {
                    maxHeight: 520,
                    minHeight: 520,
                    overflowY: "auto",
                }
            }}
            style={{top: 20}}
        >
            <Row>
                <Col span={24}>
                    {productDetails.length > 0 ? (

                        <Table
                            rowSelection={rowSelection}
                            columns={detailColumns}
                            dataSource={paginatedData.map((variant) => ({
                                ...variant,
                                key: variant.id,
                            }))}
                            rowKey="id"
                            pagination={false} // Đã sử dụng Pagination bên ngoài
                            style={{backgroundColor: "#fafafa"}}
                        />

                    ) : (
                        <Empty
                            description="Không có dữ liệu chi tiết sản phẩm."
                            style={{padding: "20px"}}
                        />
                    )}
                </Col>
            </Row>
        </Modal>
    );
};

export default memo(ProductVariant);
