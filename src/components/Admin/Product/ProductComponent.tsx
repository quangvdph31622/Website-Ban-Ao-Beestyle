"use client"
import {Flex, Layout, TableColumnsType, Tag, Tooltip, Typography, Image, Row, Col,} from "antd";
import TablePagination from "@/components/Table/TablePagination";
import HeaderProduct from "@/components/Admin/Product/HeaderProduct";
import useAppNotifications from "@/hooks/useAppNotifications";
import React, {useEffect, useState} from "react";
import ProductFilter from "@/components/Admin/Product/ProductFilter";
import {EditTwoTone, EyeTwoTone} from "@ant-design/icons";
import {useSearchParams} from "next/navigation";
import CreateProduct from "@/components/Admin/Product/CreateProduct";
import useSWR from "swr";
import {getProducts, URL_API_PRODUCT} from "@/services/ProductService";
import {GENDER_PRODUCT} from "@/constants/GenderProduct";
import dayjs from "dayjs";
import {IProductVariant} from "@/types/IProductVariant";
import {STATUS_PRODUCT} from "@/constants/StatusProduct";
import Link from "next/link";
import UpdateProduct from "@/components/Admin/Product/UpdateProduct";

const {Content} = Layout;

const ProductComponent: React.FC = () => {
    const {showNotification} = useAppNotifications();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const {data, error, isLoading, mutate} =
        useSWR(`${URL_API_PRODUCT.get}${params.size !== 0 ? `?${params.toString()}` : ''}`,
            getProducts,
            {revalidateOnFocus: false, revalidateOnReconnect: false}
        );

    useEffect(() => {
        if (error) {
            showNotification("error", {
                message: error?.message, description: error?.response?.data?.message || "Error fetching products",
            });
        }
    }, [error]);

    let result: any;
    if (!isLoading && data) {
        result = data?.data;
    }

    const columns: TableColumnsType<IProductVariant> = [
        {
            title: '', dataIndex: 'imageUrl', key: 'imageUrl', align: 'center', width: 70,
            render: (value, record) => {
                return (
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Image width={35} height={35}
                               src={value ? value : "/no-img.png"}
                               fallback="/no-img.png"
                        />
                    </div>
                );
            }
        },
        {title: 'Mã', dataIndex: 'productCode', key: 'productCode', width: 100},
        {title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName', width: 200},
        {
            title: 'Giới tính', dataIndex: 'genderProduct', key: 'genderProduct', width: 90,
            render(value: keyof typeof GENDER_PRODUCT, record) {
                return (
                    <span key={record.id}>{GENDER_PRODUCT[value]}</span>
                );
            },
        },
        {title: 'Danh mục', dataIndex: 'categoryName', key: 'categoryName',  width: 120},
        {title: 'Thương hiệu', dataIndex: 'brandName', key: 'brandName', width: 200},
        {title: 'Chất liệu', dataIndex: 'materialName', key: 'materialName', width: 120},
        {
            title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', width: 170,
            render: (value) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: 'Ngày sửa', dataIndex: 'updatedAt', key: 'updatedAt', width: 170,
            render: (value) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status', align: 'center', width: 140,
            render(value: keyof typeof STATUS_PRODUCT, record) {
                let color: string = value === 'ACTIVE' ? 'green' : 'default';
                return (
                    <Tag color={color} key={record.id}>{STATUS_PRODUCT[value]}</Tag>
                );
            },
        },
        {
            title: 'Hành động', align: 'center', width: 100,
            render: (record) => {
                return (
                    <Row gutter={[8, 8]} justify="center" align="middle">
                        <Col>
                            <Tooltip placement="top" title="Xem chi tiết">
                                <Link href={`/admin/product/${record.id}/variant`}>
                                    <EyeTwoTone
                                        style={{
                                            cursor: "pointer",
                                            padding: "5px",
                                            border: "1px solid #1677FF",
                                            borderRadius: "5px",
                                        }}
                                    />
                                </Link>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip placement="top" title="Cập nhật">
                                <EditTwoTone
                                    twoToneColor={"#f57800"}
                                    style={{
                                        cursor: "pointer",
                                        padding: "5px",
                                        border: "1px solid #f57800",
                                        borderRadius: "5px"
                                    }}
                                    onClick={() => {
                                        setIsUpdateModalOpen(true);
                                        setDataUpdate(record);
                                    }}
                                />
                            </Tooltip>
                        </Col>
                    </Row>
                )
            }
        },
    ];

    return (
        <>
            <HeaderProduct setIsCreateModalOpen={setIsCreateModalOpen}/>
            <Flex align={'flex-start'} justify={'flex-start'} gap={'middle'}>
                <ProductFilter error={error}/>
                <Content
                    className="min-w-0 bg-white"
                    style={{
                        boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)',
                        flex: 1,
                        minWidth: 700,
                    }}
                >
                    <TablePagination
                        loading={isLoading}
                        columns={columns}
                        data={result?.items ? result.items : []}
                        current={result?.pageNo}
                        pageSize={result?.pageSize}
                        total={result?.totalElements}
                    />
                </Content>
            </Flex>

            <CreateProduct
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                mutate={mutate}
            />

            <UpdateProduct
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                mutate={mutate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>

    );
}

export default ProductComponent;