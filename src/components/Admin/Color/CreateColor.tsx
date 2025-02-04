import React, {memo} from 'react';
import {Form, Input, Modal} from 'antd';
import {IColor} from "@/types/IColor";
import {createColor, URL_API_COLOR} from "@/services/ColorService";
import useAppNotifications from "@/hooks/useAppNotifications";
import ColorPickerCustomize from "@/components/ColorPicker/ColorPickerCustomize";
import {mutate} from "swr";
import {URL_API_SIZE} from "@/services/SizeService";

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (value: any) => void;
    mutate?: any;
    isLoadingSelectColor?: boolean;
}

const CreateColor = (props: IProps) => {
    const {showNotification} = useAppNotifications();
    const {isCreateModalOpen, setIsCreateModalOpen, mutate: mutateColor, isLoadingSelectColor} = props;
    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };

    const onFinish = async (value: IColor) => {
        // console.log('Success:', value);
        try {
            const result = await createColor(value);
            if(mutateColor) mutateColor();
            if (result.data) {
                handleCloseCreateModal();
                showNotification("success", {message: result.message});
            }
            await mutate(
                (key: any) => typeof key === 'string' && key.startsWith(URL_API_COLOR.option),
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
            <Modal title="Thêm mới màu sắc" cancelText="Hủy" okText="Lưu" style={{top: 20}}
                   open={isCreateModalOpen}
                   onOk={() => form.submit()}
                   onCancel={() => handleCloseCreateModal()}
                   okButtonProps={{style: {background: "#00b96b"}}}
            >
                <Form form={form} name="createColor" layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Chọn màu" name="colorCode" layout="horizontal" style={{marginTop: 24}}
                               initialValue="default"
                    >
                        <ColorPickerCustomize
                            onChange={(value) => form.setFieldsValue({colorCode: value})}
                        />
                    </Form.Item>
                    <Form.Item name="colorName" label="Tên màu sắc"
                               rules={[{required: true, message: "Vui lòng nhập tên màu sắc!"}]}
                               validateTrigger="onBlur"
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default memo(CreateColor);