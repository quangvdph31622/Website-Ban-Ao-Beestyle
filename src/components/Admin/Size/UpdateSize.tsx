"use client"
import {STATUS} from "@/constants/Status";
import {Form, Input, Modal, Select} from "antd";
import {memo, useEffect} from "react";
import {ISize} from "@/types/ISize";
import {updateSize, URL_API_SIZE} from "@/services/SizeService";
import useAppNotifications from "@/hooks/useAppNotifications";
import {mutate} from "swr";

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    mutate: any
    dataUpdate: any;
    setDataUpdate: any;
}

const UpdateSize = (props: IProps) => {
    const {showNotification} = useAppNotifications();
    const {isUpdateModalOpen, setIsUpdateModalOpen, mutate: mutateSize, dataUpdate, setDataUpdate} = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                sizeName: dataUpdate.sizeName,
                status: dataUpdate.status,
            });
        }
    }, [dataUpdate]);

    const handleCloseUpdateModal = () => {
        form.resetFields()
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
    }

    const onFinish = async (value: ISize) => {
        console.log(value);
        try {
            if (dataUpdate) {
                const data = {...value, id: dataUpdate.id}
                const result = await updateSize(data);
                mutateSize();
                if (result.data) {
                    handleCloseUpdateModal();
                    showNotification("success", {message: result.message});
                }
                await mutate(
                    (key: any) => typeof key === 'string' && key.startsWith(URL_API_SIZE.option),
                    undefined,
                    {revalidate: true}
                );
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage && typeof errorMessage === 'object') {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", {message: String(message)});
                });
            } else {
                showNotification("error", {message: error?.message, description: errorMessage,});
            }
        }
    };

    return (
        <>
            <Modal title="Chỉnh sửa kích thước" cancelText="Hủy" okText="Lưu" style={{top: 20}}
                   open={isUpdateModalOpen}
                   onOk={() => form.submit()}
                   onCancel={() => handleCloseUpdateModal()}
                   okButtonProps={{style: {background: "#00b96b"}}}
            >
                <Form form={form} name="updateSize" layout="vertical" onFinish={onFinish}>
                    <Form.Item name="sizeName" label="Tên kích thước"
                               rules={[{required: true, message: "Vui lòng nhập tên kích thước!"}]}
                               validateTrigger="onBlur"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái"
                               rules={[{required: true, message: "Vui lòng chọn trạng thái!"}]}>
                        <Select
                            options={(Object.keys(STATUS) as Array<keyof typeof STATUS>).map(
                                (key) => (
                                    {value: key, label: STATUS[key]}
                                )
                            )}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default memo(UpdateSize);
