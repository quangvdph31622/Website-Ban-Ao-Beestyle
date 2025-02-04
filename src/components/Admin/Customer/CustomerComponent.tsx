"use client";

import {getCustomers, URL_API_CUSTOMER} from "@/services/CustomerService";
import {
    Button,
    Flex,
    Layout,
    notification,
    Table,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import {ColumnType} from "antd/es/table";
import useSWR, {mutate} from "swr";
import {useEffect, useState} from "react";
import TablePagination from "@/components/Table/TablePagination";
import {EditTwoTone, EyeOutlined, EyeTwoTone} from "@ant-design/icons";
import {useSearchParams} from "next/navigation";
import HeaderCustomer from "./HeaderCustomer";
import AddCustomer from "./AddCustomer";
import UpdateCustomer from "./UpdateCustomer";
import {STATUS} from "@/constants/Status";
import CustomerFilter from "./CustomerFilter";
import useAppNotifications from "@/hooks/useAppNotifications";
import {GENDER} from "@/constants/Gender";
import Link from "next/link";
import {IAddress} from "@/types/IAddress";

const {Content} = Layout;
const CustomerComponent = () => {
    const {showNotification} = useAppNotifications();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);

    const {data, error, isLoading, mutate} = useSWR(
        `${URL_API_CUSTOMER.get}${
            params.size !== 0 ? `?${params.toString()}` : ""
        }`,
        getCustomers,
        {revalidateOnFocus: false, revalidateOnReconnect: false}
    );

    const columns: ColumnType<ICustomer>[] = [
        {title: "Họ và tên", dataIndex: "fullName", key: "fullName"},
        {title: "Ngày sinh", dataIndex: "dateOfBirth", key: "dateOfBirth"},
        {title: "Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber"},
        {title: "Email", dataIndex: "email", key: "email"},
        {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
            width: 100,
            render(value: keyof typeof GENDER, record, index) {
                return <span key={record.id}>{GENDER[value]}</span>;
            },
        },
        // {
        //   title: "Địa chỉ",
        //   dataIndex: "addresses",
        //   key: "addresses",
        //   render: (addresses) => {
        //     if (addresses && addresses.length > 0) {
        //       // List danh sách địa chỉ của customer
        //       const listAddresses = addresses|| [];
        //       console.log("danh sách địa chỉ của customer", listAddresses);

        //       // Lọc để lấy địa chỉ có isDefault: true
        //       const defaultAddress = listAddresses.find(
        //         (address: any) => address.isDefault === true
        //       );

        //       // Kiểm tra nếu tồn tại defaultAddress, nếu không thì trả về rỗng
        //       const addressToDisplay = defaultAddress || "";
        //       console.log("addressToDisplay ", addressToDisplay);

        //       // Kiểm tra addressToDisplay trước khi truy cập addressName
        //       return addressToDisplay.addressName
        //         ? `${addressToDisplay?.addressName} - ${addressToDisplay?.commune} - ${addressToDisplay?.district} - ${addressToDisplay?.city}`
        //         : `${addressToDisplay?.commune} - ${addressToDisplay?.district} - ${addressToDisplay?.city}`;
        //     }
        //     return ""; // Nếu không có địa chỉ nào trong mảng
        //   },
        // },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render(value: keyof typeof STATUS, record, index) {
                let color: string = value === "ACTIVE" ? "green" : "default";
                // console.log(record);
                // console.log(value);
                return (
                    <Tag color={color} key={record.id}>
                        {STATUS[value]}
                    </Tag>
                );
            },
        },

        {
            title: "Hành động",
            render: (text: any, record: ICustomer, index: number) => (
                <div className="flex gap-3">
                    <Tooltip placement="top" title="Chi tiết">
                        <Link href={`/admin/customer/${record.id}`}>
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
                    {/* <Tooltip placement="top" title="Cập nhật">
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
          </Tooltip> */}
                </div>
            ),
        },
    ];

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

    console.log(result);

    return (
        <div>
            <HeaderCustomer setIsCreateModalOpen={setIsCreateModalOpen}/>
            <Flex align={"flex-start"} justify={"flex-start"} gap={"middle"}>
                <CustomerFilter error={error}/>
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

            <AddCustomer
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                mutate={mutate}
            />

            <UpdateCustomer
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                mutate={mutate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </div>
    );
};

export default CustomerComponent;
