"use client"
import {memo} from 'react';
import {Form, Input, Modal} from 'antd';
import {IMaterial} from '@/types/IMaterial';
import {createMaterial, URL_API_MATERIAL} from '@/services/MaterialService';
import useAppNotifications from "@/hooks/useAppNotifications";
import {mutate} from "swr";
import {URL_API_SIZE} from "@/services/SizeService";

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (value: any) => void;
    mutate?: any;
    isLoadingSelectMaterial?: boolean;
    formName?: string;
}

const CreateMaterial = (props: IProps) => {
    // console.log("Create Material render");
    const {
        isCreateModalOpen,
        setIsCreateModalOpen,
        mutate: mutateMaterials,
        isLoadingSelectMaterial,
        formName = "createMaterial"
    } = props;
    const {showNotification} = useAppNotifications();
    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };

    const onFinish = async (value: IMaterial) => {
        // console.log('Success:', value);
        try {
            const result = await createMaterial(value);
            if (mutateMaterials) mutateMaterials();
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
            <Modal title="Thêm chất liệu" cancelText="Hủy" okText="Lưu" style={{top: 20}}
                   open={isCreateModalOpen}
                   onOk={() => form.submit()}
                   onCancel={() => handleCloseCreateModal()}
                   okButtonProps={{style: {background: "#00b96b"}}}
            >
                <Form form={form} name={formName} layout="vertical" onFinish={onFinish}
                >
                    <Form.Item name="materialName" label="Tên chất liệu"
                               rules={[{required: true, message: "Vui lòng nhập tên chất liệu!"}]}
                               validateTrigger="onBlur"
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default memo(CreateMaterial);