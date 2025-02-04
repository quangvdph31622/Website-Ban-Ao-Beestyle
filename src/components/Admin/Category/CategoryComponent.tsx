"use client"
import {App, Flex, Layout, TableColumnsType, Tag, Tooltip} from "antd";
import useSWR from "swr";
import {IBrand} from "@/types/IBrand";
import {DeleteTwoTone, EditTwoTone} from "@ant-design/icons";
import TablePagination from "@/components/Table/TablePagination";
import {getBrands} from "@/services/BrandService";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {STATUS} from "@/constants/Status";
import {getCategories, URL_API_CATEGORY} from "@/services/CategoryService";
import HeaderCategory from "@/components/Admin/Category/HeaderCategory";
import CreateCategory from "@/components/Admin/Category/CreateCategory";
import UpdateCategory from "@/components/Admin/Category/UpdateCategory";
import CategoryFilter from "@/components/Admin/Category/CategoryFilter";
import CategoryDisplayOrderModal from "@/components/Admin/Category/CategoryDisplayOrderModal";
import useAppNotifications from "@/hooks/useAppNotifications";

const {Content} = Layout;

const CategoryComponent = () => {
    const { showNotification } = useAppNotifications();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isCategoryDisplayOrderModalOpen, setIsCategoryDisplayOrderModalOpen] =
        useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const {data, error, isLoading, mutate} =
        useSWR(
            `${URL_API_CATEGORY.get}${params.size !== 0 ? `?${params.toString()}` : ''}`,
            getCategories,
            {
                revalidateOnFocus: false,
            }
        );

    const columns: TableColumnsType<IBrand> = [
        {title: 'Tên danh mục', dataIndex: 'categoryName', key: 'categoryName'},
        {title: 'Slug', dataIndex: 'slug', key: 'slug'},
        {title: 'Danh mục cha', dataIndex: 'parentCategoryName', key: 'parentCategoryName'},
        {title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt'},
        {title: 'Ngày sửa', dataIndex: 'updatedAt', key: 'updatedAt'},
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
                                twoToneColor={"#FAAD14"}
                                style={{
                                    cursor: "pointer", padding: "5px", border: "1px solid #FAAD14", borderRadius: "5px",
                                    marginRight: 10
                                }}
                                onClick={() => {
                                    setIsUpdateModalOpen(true);
                                    setDataUpdate(record);
                                }}
                            />
                        </Tooltip>
                        <Tooltip placement="top" title="Xóa">
                            <DeleteTwoTone
                                twoToneColor={"#FF4D4F"}
                                style={{
                                    cursor: "pointer", padding: "5px", border: "1px solid #FF4D4F", borderRadius: "5px"
                                }}
                            />
                        </Tooltip>
                    </>
                )
            }
        },
    ];

    useEffect(() => {
        if (error) {
            showNotification("error",{
                message: error?.message, description: error?.response?.data?.message || "Error fetching categories",
            });
        }
    }, [error]);

    let result: any;
    if (!isLoading && data) result = data?.data;

    return (
        <>
            <HeaderCategory
                setIsCreateModalOpen={setIsCreateModalOpen}
                setIsCategoryDisplayOrderModalOpen={setIsCategoryDisplayOrderModalOpen}
            />
            <Flex align={'flex-start'} justify={'flex-start'} gap={'middle'}>
                <CategoryFilter error={error}/>
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

            <CreateCategory
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                mutate={mutate}
                isLoadingSelectTreeCategory={true}
            />

            <UpdateCategory
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                mutate={mutate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />

            <CategoryDisplayOrderModal
                isCategoryDisplayOrderModalOpen={isCategoryDisplayOrderModalOpen}
                setIsCategoryDisplayOrderModalOpen={setIsCategoryDisplayOrderModalOpen}
            />
        </>
    )
}

export default CategoryComponent;