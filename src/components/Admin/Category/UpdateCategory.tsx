import {STATUS} from "@/constants/Status";
import {App, Form, Input, Modal, notification, Radio, Select, TreeSelect} from "antd";
import {memo, useEffect} from "react";
import {ICategory} from "@/types/ICategory";
import {updateCategory, URL_API_CATEGORY} from "@/services/CategoryService";
import useCategory from "@/components/Admin/Category/hooks/useCategory";
import useAppNotifications from "@/hooks/useAppNotifications";
import {mutate} from "swr";

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    mutate: any
    dataUpdate: any;
    setDataUpdate: any;
}

const UpdateCategory = (props: IProps) => {
    const {showNotification} = useAppNotifications();
    const {isUpdateModalOpen, setIsUpdateModalOpen, mutate: mutateCategories, dataUpdate, setDataUpdate} = props;
    const [form] = Form.useForm();
    const {dataTreeSelectCategory, error, isLoading} = useCategory(isUpdateModalOpen);

    useEffect(() => {
        if (error && isUpdateModalOpen) {
            showNotification("error", {
                message: error?.message || "Error fetching category input select",
                description: error?.response?.data?.message,
            });
        }
    }, [isUpdateModalOpen]);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                categoryName: dataUpdate.categoryName,
                slug: dataUpdate.slug,
                parentCategoryId: dataUpdate.parentCategoryId,
                status: dataUpdate.status,
            });
        }
        console.log(dataUpdate);
    }, [dataUpdate]);

    const handleCloseUpdateModal = () => {
        form.resetFields()
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
    }

    const onFinish = async (value: ICategory) => {
        console.log(value);
        try {
            if (dataUpdate) {
                if (dataUpdate.id === value.parentCategoryId)
                    throw Error("Không thể chọn danh mục làm cha cho chính nó.");

                const data = {...value, id: dataUpdate.id}
                const result = await updateCategory(data);
                mutateCategories();
                if (result.data) {
                    handleCloseUpdateModal();
                    showNotification("success", {message: result.message});
                }
                await mutate(URL_API_CATEGORY.option);
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
            <Modal title="Chỉnh sửa danh mục" cancelText="Hủy" okText="Lưu" style={{top: 20}}
                   open={isUpdateModalOpen}
                   onOk={() => form.submit()}
                   onCancel={() => handleCloseUpdateModal()}
                   okButtonProps={{style: {background: "#00b96b"}}}
            >
                <Form form={form} name="updateCategory" layout="vertical" onFinish={onFinish}>
                    <Form.Item name="categoryName" label="Tên danh mục"
                               rules={[{required: true, message: "Vui lòng nhập tên danh mục!"}]}
                               validateTrigger="onBlur"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item name="slug" label="Slug">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="parentCategoryId" label="Danh mục cha">
                        <TreeSelect showSearch allowClear placement="bottomLeft"
                            placeholder={isLoading ? "Đang tải..." : "---Lựa chọn---"}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            treeData={dataTreeSelectCategory}
                            loading={isLoading}
                            filterTreeNode={(search, item) => {
                                let title = item.title?.toString() || "";
                                return title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                            }}
                        />
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
export default memo(UpdateCategory);
