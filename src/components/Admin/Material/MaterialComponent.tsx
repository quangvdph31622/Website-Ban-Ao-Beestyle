"use client"
import {Flex, Layout, TableColumnsType, Tag, Tooltip,} from "antd";
import {EditTwoTone} from "@ant-design/icons";
import type {IMaterial} from "@/types/IMaterial";
import TablePagination from "@/components/Table/TablePagination";
import {getMaterials, URL_API_MATERIAL} from "@/services/MaterialService";
import useSWR from "swr";
import {useEffect, useState} from "react";
import CreateMaterial from "./CreateMaterial";
import UpdateMaterial from "./UpdateMaterial";
import {STATUS} from "@/constants/Status";
import MaterialFilter from "@/components/Admin/Material/MaterialFilter";
import {useSearchParams} from "next/navigation";
import HeaderMaterial from "@/components/Admin/Material/HeaderMaterial";
import useAppNotifications from "@/hooks/useAppNotifications";

const {Content} = Layout;

const MaterialComponent = () => {
    const { showNotification } = useAppNotifications();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const {data, error, isLoading, mutate} =
        useSWR(`${URL_API_MATERIAL.get}${params.size !== 0 ? `?${params.toString()}` : ''}`,
            getMaterials,
            {
                revalidateOnFocus: false,
                revalidateOnReconnect: false
            }
        );

    const columns: TableColumnsType<IMaterial> = [
        {title: 'Tên chất liệu', dataIndex: 'materialName', key: 'materialName'},
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
                    </>
                )
            }
        },
    ];

    useEffect(() => {
        if (error) {
            showNotification("error",{
                message: error?.message, description: error?.response?.data?.message || "Error fetching materials",
            });
        }
    }, [error]);

    let result: any;
    if (!isLoading && data) result = data?.data;

    return (
        <>
            <HeaderMaterial setIsCreateModalOpen={setIsCreateModalOpen}/>
            <Flex align={'flex-start'} justify={'flex-start'} gap={'middle'}>
                <MaterialFilter error={error}/>
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

            <CreateMaterial
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                mutate={mutate}
            />

            <UpdateMaterial
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                mutate={mutate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}
export default MaterialComponent;