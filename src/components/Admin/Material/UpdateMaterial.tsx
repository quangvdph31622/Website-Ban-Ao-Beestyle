import {STATUS} from "@/constants/Status";
import {updateMaterial, URL_API_MATERIAL} from "@/services/MaterialService";
import {IMaterial} from "@/types/IMaterial";
import {Form, Input, Modal, Select} from "antd";
import {memo, useEffect} from "react";
import useAppNotifications from "@/hooks/useAppNotifications";
import {mutate} from "swr";
import {URL_API_SIZE} from "@/services/SizeService";

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    mutate: any;
    dataUpdate: any;
    setDataUpdate: any;
}

const UpdateMaterial = (props: IProps) => {
    // console.log("Update Material render");
    const {showNotification} = useAppNotifications();
    const {isUpdateModalOpen, setIsUpdateModalOpen, mutate: mutateMaterial, dataUpdate, setDataUpdate} = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                materialName: dataUpdate.materialName,
                status: dataUpdate.status,
            });
        }
    }, [dataUpdate]);

    const handleCloseUpdateModal = () => {
        form.resetFields();
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
    };

    const onFinish = async (value: IMaterial) => {
        console.log("Material update", JSON.stringify(value, null, 2));
        try {
            if (dataUpdate) {
                const data = {...value, id: dataUpdate.id,};
                const result = await updateMaterial(data);
                mutateMaterial();
                if (result.data) {
                    handleCloseUpdateModal();
                    showNotification("success", {message: result.message});
                }
                await mutate(
                    (key: any) => typeof key === 'string' && key.startsWith(URL_API_MATERIAL.option),
                    undefined,
                    {revalidate: true}
                );
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
        <>
            <Modal title="Chỉnh sửa chất liệu" cancelText="Hủy" okText="Lưu" style={{top: 20}}
                   open={isUpdateModalOpen}
                   onOk={() => form.submit()}
                   onCancel={() => handleCloseUpdateModal()}
                   okButtonProps={{style: {background: "#00b96b"}}}
            >
                <Form form={form} name="updateMaterial" layout="vertical" onFinish={onFinish}>
                    <Form.Item name="materialName" label="Tên chất liệu"
                               rules={[{required: true, message: "Vui lòng nhập tên chất liệu!"}]}>
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
export default memo(UpdateMaterial);