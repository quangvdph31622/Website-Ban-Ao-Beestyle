"use client";

import ProductCard from "@/components/User/ProductCommonUser/ProductCardItem";
import FilterProductUser from "@/components/User/ShopProductGrid/FilterProductUser";
import { Col, Flex, Pagination, PaginationProps, Row, Typography } from "antd";
import HeaderShopGrid from "@/components/User/ShopProductGrid/HeaderShopGrid";
import useFilterProduct, { ParamFilterProduct } from "@/components/Admin/Product/hooks/useFilterProduct";
import React, { useEffect, useState } from "react";
import SubLoader from "@/components/Loader/SubLoader";
import { useDebounce } from "use-debounce";
import BreadcrumbSection from "@/components/Breadcrumb/BreadCrumb";

const { Text } = Typography;

export const defaultFilterParam: ParamFilterProduct = {
    page: 1,
    size: 20,
    category: undefined,
    gender: undefined,
    brand: undefined,
    material: undefined,
    minPrice: undefined,
    maxPrice: undefined,
};

const ShopProductGridComponent: React.FC = () => {
    const [filterParam, setFilterParam] = useState<ParamFilterProduct>({ ...defaultFilterParam });
    const [debounceFilterParam] = useDebounce(filterParam, 1000);
    const { dataFilterProduct, isLoading } = useFilterProduct(debounceFilterParam);

    const onChange: PaginationProps['onChange'] = (page, pageSize) => {
        setFilterParam((prevValue) => ({ ...prevValue, page: page, size: pageSize }));
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [filterParam.page]);

    const breadcrumbItems = [
        { title: 'Trang chủ', path: '/' },
        { title: 'Sản phẩm' },
    ];

    return (
        <>
            <BreadcrumbSection items={breadcrumbItems} />

            <Flex justify="center" className="section">
                <div style={{ width: "85%" }}>
                    <Row gutter={[24, 24]} style={{ minWidth: 800 }}>
                        <Col span={5} style={{ minWidth: 120 }}>
                            <FilterProductUser filterParam={filterParam} setFilterParam={setFilterParam} />
                        </Col>
                        <Col span={19}>
                            <Row gutter={[8, 8]}>
                                <Col span={24}>
                                    <HeaderShopGrid />
                                </Col>
                                <Col span={24} className="h-full w-full">
                                    <Row gutter={[16, 16]} className="h-full w-full">
                                        {
                                            isLoading ? (
                                                <SubLoader size="small" spinning={isLoading} />
                                            ) : (
                                                dataFilterProduct?.items?.length > 0 ? (
                                                    dataFilterProduct?.items.map((product: any) => (
                                                        <Col xs={12} sm={12} md={12}
                                                            lg={8} xl={8} xxl={6}
                                                            key={product.id}
                                                        >
                                                            <ProductCard product={product} />
                                                        </Col>
                                                    )
                                                    )
                                                ) : (
                                                    <Text>Chưa có sản phẩm nào trong danh mục này.</Text>
                                                )
                                            )
                                        }
                                    </Row>
                                    <Flex justify="center" className="mt-5 mb-5">
                                        <Pagination
                                            current={filterParam.page ?? 1}
                                            onChange={onChange}
                                            showSizeChanger={false}
                                            defaultPageSize={filterParam.size ?? 20}
                                            total={dataFilterProduct?.totalElements}
                                        />
                                    </Flex>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Flex>
        </>
    );
};

export default ShopProductGridComponent;
