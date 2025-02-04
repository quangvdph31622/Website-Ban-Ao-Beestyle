import React, {memo} from 'react';
import {App, Form, Input, Modal, notification} from 'antd';
import {IBrand} from "@/types/IBrand";
import {createBrand, URL_API_BRAND} from "@/services/BrandService";
import useAppNotifications from "@/hooks/useAppNotifications";
import {mutate} from "swr";
import {URL_API_COLOR} from "@/services/ColorService";

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (value: any) => void;
    mutate?: any;
    isLoadingSelectBrand?: boolean;
    formName?: string;
}

const CreateBrand = (props: IProps) => {
    const {
        isCreateModalOpen,
        setIsCreateModalOpen,
        mutate: mutateBrand,
        isLoadingSelectBrand,
        formName = "createBrand"
    } = props;
    const {showNotification} = useAppNotifications();
    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };

    const onFinish = async (value: IBrand) => {
        // console.log('Success:', value);
        try {
            const result = await createBrand(value);
            if (mutateBrand) mutateBrand();
            if (result.data) {
                handleCloseCreateModal();
                showNotification("success", {message: result.message});
            }
            await mutate(
                (key: any) => typeof key === 'string' && key.startsWith(URL_API_BRAND.option),
                undefined,
                {revalidate: true}
            );        } catch (error: any) {
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
            <Modal title="Thêm mới thương hiệu" cancelText="Hủy" okText="Lưu" style={{top: 20}}
                   open={isCreateModalOpen}
                   onOk={() => form.submit()}
                   onCancel={() => handleCloseCreateModal()}
                   okButtonProps={{style: {background: "#00b96b"}}}
            >
                <Form form={form} name={formName} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="brandName" label="Tên thương hiệu"
                               rules={[{required: true, message: "Vui lòng nhập tên thương hiệu!"}]}
                               validateTrigger="onBlur"
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default memo(CreateBrand);