"use client";
import {
    Flex,
    Tag,
    Tooltip,
} from "antd";
import { ColumnType } from "antd/es/table";
import useSWR from "swr";
import { useEffect, useState } from "react";
import TablePagination from "@/components/Table/TablePagination";
import { Content } from "antd/es/layout/layout";
import { EditTwoTone } from "@ant-design/icons";
import { useSearchParams } from "next/navigation";
import { STATUS } from "@/constants/Status";
import CustomerFilter from "./StaffFilter";
import { getStaff, URL_API_STAFF } from "@/services/StaffService";
import AddStaff from "./AddStaff";
import UpdateStaff from "./UpdateStaff";
import HeaderStaff from "./HeaderStaff";
import useAppNotifications from "@/hooks/useAppNotifications";
import { GENDER } from "@/constants/Gender";
import { getAdminAccountInfo } from "@/utils/AppUtil";
import Unauthorized from "@/app/unauthorized/page";

const StaffComponent = () => {
    const { showNotification } = useAppNotifications();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const { data, error, isLoading, mutate } = useSWR(
        `${URL_API_STAFF.get}${params.size !== 0 ? `?${params.toString()}` : ""
        }`,
        getStaff,
        { revalidateOnFocus: false, revalidateOnReconnect: false }
    );

    useEffect(() => {
        if (error) {
            showNotification("error", {
                message: error?.message,
                description:
                    error?.response?.data?.message || "Error fetching customers",
            });
        }
    }, [error]);

    let result: any;
    if (!isLoading && data) {
        result = data?.data;
    }


    const columns: ColumnType<IStaff>[] = [
        { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
        { title: "Ngày sinh", dataIndex: "dateOfBirth", key: "dateOfBirth" },
        { title: "Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber" },
        { title: "Email", dataIndex: "email", key: "email" },
        {
            title: 'Giới tính', dataIndex: 'gender', key: 'gender', width: 100,
            render(value: keyof typeof GENDER, record, index) {
                return (
                    <span key={record.id}>{GENDER[value]}</span>
                );
            },
        },
        { title: "Ngày tạo", dataIndex: "createdAt", key: "createAt", },
        { title: "Ngày sửa", dataIndex: "updatedAt", key: "updateAt", },

        {
            title: "Trạng thái", dataIndex: "status", key: "status",
            render(value: keyof typeof STATUS, record, index) {
                let color: string = value === "ACTIVE" ? "green" : "default";
                return (
                    <Tag color={color} key={record.id}>
                        {STATUS[value]}
                    </Tag>
                );
            },
        },
        {
            title: "Hành động",
            render: (text: any, record: IStaff, index: number) => (
                <div className="flex gap-3">
                    <Tooltip placement="top" title="Cập nhật">
                        <EditTwoTone
                            twoToneColor={"#f57800"}
                            style={{
                                cursor: "pointer",
                                padding: "5px",
                                border: "1px solid #f57800",
                                borderRadius: "5px",
                            }}
                            onClick={() => {
                                setIsUpdateModalOpen(true);
                                setDataUpdate(record);
                            }}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];



    return (
        <>
            {getAdminAccountInfo() && getAdminAccountInfo()?.role === 'ADMIN' ? (
                <div>
                    <HeaderStaff setIsCreateModalOpen={setIsCreateModalOpen} />
                    <Flex align={"flex-start"} justify={"flex-start"} gap={"middle"}>
                        <CustomerFilter error={error} />
                        <Content
                            className="min-w-0 bg-white"
                            style={{
                                boxShadow: "0 1px 8px rgba(0, 0, 0, 0.15)",
                                flex: 1,
                                minWidth: 700,
                                borderRadius: "8px 8px 0px 0px",
                            }}
                        >
                            <TablePagination
                                loading={isLoading}
                                columns={columns}
                                data={result?.items ? result.items : []}
                                current={result?.pageNo}
                                pageSize={result?.pageSize}
                                total={result?.totalElements}
                            ></TablePagination>
                        </Content>
                    </Flex>
                    <AddStaff
                        isCreateModalOpen={isCreateModalOpen}
                        setIsCreateModalOpen={setIsCreateModalOpen}
                        mutate={mutate}
                    />
                    <UpdateStaff
                        isUpdateModalOpen={isUpdateModalOpen}
                        setIsUpdateModalOpen={setIsUpdateModalOpen}
                        mutate={mutate}
                        dataUpdate={dataUpdate}
                        setDataUpdate={setDataUpdate}
                    />
                </div>
            ) : (<Unauthorized />)}
        </>
    );
};

export default StaffComponent;
