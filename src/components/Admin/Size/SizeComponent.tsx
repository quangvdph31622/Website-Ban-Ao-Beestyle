"use client"
import {App, Flex, Layout, notification, TableColumnsType, Tag, Tooltip,} from "antd";
import {EditTwoTone} from "@ant-design/icons";
import type {IMaterial} from "@/types/IMaterial";
import TablePagination from "@/components/Table/TablePagination";
import useSWR from "swr";
import {useEffect, useState} from "react";
import {STATUS} from "@/constants/Status";
import {useSearchParams} from "next/navigation";
import {getSizes, URL_API_SIZE} from "@/services/SizeService";
import HeaderSize from "@/components/Admin/Size/HeaderSize";
import SizeFilter from "@/components/Admin/Size/SizeFilter";
import CreateSize from "./CreateSize";
import UpdateSize from "./UpdateSize";
import useAppNotifications from "@/hooks/useAppNotifications";

const {Content} = Layout;

const SizeComponent = () => {
    const { showNotification } = useAppNotifications();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const {data, error, isLoading, mutate} =
        useSWR(`${URL_API_SIZE.get}${params.size !== 0 ? `?${params.toString()}` : ''}`,
            getSizes,
            {
                revalidateOnFocus: false,
                revalidateOnReconnect: false
            }
        );

    const columns: TableColumnsType<IMaterial> = [
        {title: 'Tên kích thước', dataIndex: 'sizeName', key: 'sizeName'},
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
            showNotification("error", {
                message: error?.message, description: error?.response?.data?.message || "Error fetching sizes",
            });
        }
    }, [error]);

    let result: any;
    if (!isLoading && data) {
        result = data?.data;
    }

    return (
        <>
            <HeaderSize setIsCreateModalOpen={setIsCreateModalOpen}/>
            <Flex align={'flex-start'} justify={'flex-start'} gap={'middle'}>
                <SizeFilter error={error}/>
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

            <CreateSize
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                mutate={mutate}
            />

            <UpdateSize
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                mutate={mutate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}
export default SizeComponent;