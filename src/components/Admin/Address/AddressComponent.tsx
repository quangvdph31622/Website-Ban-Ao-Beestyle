"use client";

import {IAddress} from "@/types/IAddress";
import {PlusOutlined} from "@ant-design/icons";
import {Button, Collapse, Popconfirm, Space, Tag, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {
    deleteAddress,
    getAddressByCustomerId,
    setIsDefault,
    URL_API_ADDRESS,
} from "@/services/AddressService";
import useSWR from "swr";
import {useParams} from "next/navigation";
import useAppNotifications from "@/hooks/useAppNotifications";
import CreateAddressModal from "./CreateAddressModal";
import UpdateAddress from "./UpdateAddress";
import {formatAddress} from "@/utils/AppUtil";

const {Title, Text} = Typography;
const {Panel} = Collapse;

const AddressComponent = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
    const {id} = useParams();
    const {showNotification} = useAppNotifications();

    const {data, error, mutate} = useSWR(
        `${URL_API_ADDRESS.get}?id=${id}`,
        getAddressByCustomerId,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );
    const handleUpdateAddress = (address: IAddress) => {
        console.log("update");
        setSelectedAddress(address);
        setIsUpdateModalOpen(true);
    };
    const handleDeleteAddress = async (address: IAddress) => {
        try {
            const result = await deleteAddress(address);
            console.log(result);

            if (result.code == 200) {
                mutate()
                showNotification("success", {message: result.message});
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage && typeof errorMessage === "object") {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", {message: String(message)});
                });
            } else {
                showNotification("error", {
                    message: error?.message,
                    description: errorMessage,
                });
            }
        }
    }
    const addresses = data?.data?.items || [];
    console.log(addresses); 

    useEffect(() => {
        if (error) {
            showNotification("error", {
                message: error?.message,
                description:
                    error?.response?.data?.message || "Error fetching addresses",
            });
        }
    }, [error]);

    const handleSetDefault = async (record: IAddress) => {
        try {
            if (record) {
                const data = {...record, isDefault: true, id: record.id};
                const result = await setIsDefault(data);
                await mutate();

                if (result.data) {
                    showNotification("success", {message: result.message});
                }
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage && typeof errorMessage === "object") {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", {message: String(message)});
                });
            } else {
                showNotification("error", {
                    message: error?.message,
                    description: errorMessage,
                });
            }
        }
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "end",
                    marginBottom: "20px",
                }}
            >
                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Thêm địa chỉ
                </Button>
            </div>
            <Collapse
                accordion
                style={{
                    background: "transparent", // Xóa màu nền của Collapse
                    border: "none", // Xóa viền
                }}
            >
                {addresses.map((address: IAddress, index: number) => (
                    <Panel
                        header={
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                }}
                            >
                                <Text strong>{`Địa chỉ ${index + 1}`}</Text>
                                {address.isDefault && <Tag color="green">Mặc định</Tag>}
                            </div>
                        }
                        key={address.id}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "30px",
                            }}
                        >
                            <Text>
                                {formatAddress(address)}
                            </Text>
                            <br/>
                            <div style={{flexShrink: 0}}>
                                <div
                                    style={{display: "flex", gap: "10px", marginBottom: "10px"}}
                                >
                                    <Button
                                        type="primary"
                                        onClick={() => handleUpdateAddress(address)}
                                    >
                                        Sửa
                                    </Button>
                                    <Popconfirm
                                        placement="left"
                                        title="Bạn có muốn xóa địa chỉ này không?"
                                        onConfirm={() => handleDeleteAddress(address)}
                                        okText="Yes"
                                        cancelText="No"
                                    >

                                        <Button danger>Xóa</Button>
                                    </Popconfirm>
                                </div>
                                <div>
                                    {address.isDefault ? (
                                        <Button disabled>Đặt mặc định</Button>
                                    ) : (
                                        <Popconfirm
                                            placement="left"
                                            title="Bạn có muốn đặt địa chỉ làm mặc định hay không?"
                                            onConfirm={() => handleSetDefault(address)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button>Đặt mặc định</Button>
                                        </Popconfirm>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Panel>
                ))}
            </Collapse>

            <CreateAddressModal
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                mutate={mutate}
            />
            {isUpdateModalOpen && selectedAddress && (
                <UpdateAddress
                    mutate={mutate}
                    isUpdateModalOpen={isUpdateModalOpen}
                    setIsUpdateModalOpen={setIsUpdateModalOpen}
                    initialValues={selectedAddress}
                />
            )}
        </div>
    );
};

export default AddressComponent;
