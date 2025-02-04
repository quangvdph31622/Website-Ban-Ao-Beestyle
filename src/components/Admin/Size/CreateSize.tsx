"use client"
import {memo} from 'react';
import {App, Form, Input, Modal, notification} from 'antd';
import {ISize} from "@/types/ISize";
import {createSize, URL_API_SIZE} from "@/services/SizeService";
import useAppNotifications from "@/hooks/useAppNotifications";
import {mutate} from "swr";
import {URL_API_COLOR} from "@/services/ColorService";

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (value: any) => void;
    mutate?: any;
    isLoadingSelectSize?: boolean;
}

const CreateSize = (props: IProps) => {
    const {showNotification} = useAppNotifications();
    const {isCreateModalOpen, setIsCreateModalOpen, mutate: mutateSize, isLoadingSelectSize} = props;
    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };

    const onFinish = async (value: ISize) => {
        // console.log('Success:', value);
        try {
            const result = await createSize(value);
            if(mutateSize) mutateSize();
            if (result.data) {
                handleCloseCreateModal();
                showNotification("success", {message: result.message});
            }
            await mutate(
                (key: any) => typeof key === 'string' && key.startsWith(URL_API_SIZE.option),
                undefined,
                {revalidate: true}
            );
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
    }

    return (
        <>
            <Modal title="Thêm mới kích thước" cancelText="Hủy" okText="Lưu" style={{top: 20}}
                   open={isCreateModalOpen}
                   onOk={() => form.submit()}
                   onCancel={() => handleCloseCreateModal()}
                   okButtonProps={{style: {background: "#00b96b"}}}
            >
                <Form form={form} name="createSize" layout="vertical" onFinish={onFinish}>
                    <Form.Item name="sizeName" label="Tên kích thước"
                               rules={[{required: true, message: "Vui lòng nhập tên kích thước!"}]}
                               validateTrigger="onBlur"
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default memo(CreateSize);