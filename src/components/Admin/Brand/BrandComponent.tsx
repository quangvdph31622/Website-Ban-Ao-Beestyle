"use client"
import { Flex, Layout, TableColumnsType, Tag, Tooltip } from "antd";
import useSWR from "swr";
import { IBrand } from "@/types/IBrand";
import { EditTwoTone } from "@ant-design/icons";
import TablePagination from "@/components/Table/TablePagination";
import { getBrands, URL_API_BRAND } from "@/services/BrandService";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { STATUS } from "@/constants/Status";
import CreateBrand from "@/components/Admin/Brand/CreateBrand";
import UpdateBrand from "@/components/Admin/Brand/UpdateBrand";
import HeaderBrand from "@/components/Admin/Brand/HeaderBrand";
import BrandFilter from "@/components/Admin/Brand/BrandFilter";
import useAppNotifications from "@/hooks/useAppNotifications";

const { Content } = Layout;

const BrandComponent = () => {
    const { showNotification } = useAppNotifications();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const { data, error, isLoading, mutate } =
        useSWR(
            `${URL_API_BRAND.get}${params.size !== 0 ? `?${params.toString()}` : ''}`,
            getBrands,
            {
                revalidateOnFocus: false,
                revalidateOnReconnect: false
            }
        );

    useEffect(() => {
        if (error) {
            showNotification("error", {
                message: error?.message, description: error?.response?.data?.message || "Error fetching brands",
            });
        }
    }, [error]);

    let result: any;
    if (!isLoading && data) {
        result = data?.data;
    }

    const columns: TableColumnsType<IBrand> = [
        { title: 'Tên thương hiệu', dataIndex: 'brandName', key: 'brandName' },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
        { title: 'Ngày sửa', dataIndex: 'updatedAt', key: 'updatedAt' },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render(value: keyof typeof STATUS, record, index) {
                let color: string = value === 'ACTIVE' ? 'green' : 'default';
                return (
                    <Tag color={color} key={record.id}>{STATUS[value]}</Tag>
                );
            },
        },
        {
            title: 'Hành động', align: 'center', render: (record) => {
                return (
                    <>
                        <Tooltip placement="top" title="Cập nhật">
                            <EditTwoTone
                                twoToneColor={"#f57800"}
                                style={{ cursor: "pointer", padding: "5px", border: "1px solid #f57800", borderRadius: "5px" }}
                                onClick={() => {
                                    setIsUpdateModalOpen(true);
                                    setDataUpdate(record);
                                }}
                            />
                        </Tooltip>
                    </>
                )
            }
        },
    ];

    return (
        <>
            <HeaderBrand setIsCreateModalOpen={setIsCreateModalOpen} />
            <Flex align={'flex-start'} justify={'flex-start'} gap={'middle'}>
                <BrandFilter error={error} />
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
                    >
                    </TablePagination>
                </Content>
            </Flex>

            <CreateBrand
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                mutate={mutate}
            />

            <UpdateBrand
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                mutate={mutate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}

export default BrandComponent;
