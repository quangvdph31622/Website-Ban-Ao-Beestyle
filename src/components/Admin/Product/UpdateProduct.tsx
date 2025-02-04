"use client"
import {Button, Col, Flex, Form, Input, Modal, Row, Select, Space, Tooltip, TreeSelect, UploadFile} from "antd";
import {STATUS_PRODUCT} from "@/constants/StatusProduct";
import React, {memo, useCallback, useEffect, useState} from "react";
import useAppNotifications from "@/hooks/useAppNotifications";
import {IProduct} from "@/types/IProduct";
import useBrand from "@/components/Admin/Brand/hooks/useBrand";
import useCategory from "@/components/Admin/Category/hooks/useCategory";
import useMaterial from "@/components/Admin/Material/hooks/useMaterial";
import UploadImage from "@/components/Upload/UploadImage";
import {IProductImageCreate} from "@/types/IProductImage";
import {GENDER_PRODUCT} from "@/constants/GenderProduct";
import SelectSearchOptionLabel from "@/components/Select/SelectSearchOptionLabel";
import {PlusOutlined} from "@ant-design/icons";
import CreateCategory from "@/components/Admin/Category/CreateCategory";
import CreateBrand from "@/components/Admin/Brand/CreateBrand";
import CreateMaterial from "@/components/Admin/Material/CreateMaterial";
import {updateProduct, URL_API_PRODUCT} from "@/services/ProductService";
import TextArea from "antd/es/input/TextArea";
import {mutate} from "swr";

type CreateFastModalType = "category" | "material" | "brand";

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    mutate: any
    dataUpdate: any;
    setDataUpdate: any;
}

const UpdateProduct: React.FC<IProps> = (props) => {
    const {showNotification} = useAppNotifications();
    const {isUpdateModalOpen, setIsUpdateModalOpen, mutate: mutateProduct, dataUpdate, setDataUpdate} = props;
    const [form] = Form.useForm();

    const [modalOpen, setModalOpen] = useState({
        category: false, material: false, brand: false,
    });
    const [confirmLoading, setConfirmLoading] = useState(false);

    const {dataOptionBrand, error: errorDataOptionBrand, isLoading: isLoadingDataOptionBrand}
        = useBrand(isUpdateModalOpen);
    const {dataTreeSelectCategory, error: errorDataTreeSelectCategory, isLoading: isLoadingDataTreeSelectCategory}
        = useCategory(isUpdateModalOpen);
    const {dataOptionMaterial, error: errorDataOptionMaterial, isLoading: isLoadingDataOptionMaterial}
        = useMaterial(isUpdateModalOpen);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                productCode: dataUpdate.productCode,
                productName: dataUpdate.productName,
                genderProduct: dataUpdate.genderProduct,
                categoryId: dataUpdate.categoryId,
                brandId: dataUpdate.brandId,
                materialId: dataUpdate.materialId,
                description: dataUpdate.description,
                status: dataUpdate.status,
            });
        }
    }, [dataUpdate]);

    const toggleCreateFastModal = useCallback((modalType: CreateFastModalType, isOpen: boolean) => {
        setModalOpen((prevModals) => ({...prevModals, [modalType]: isOpen}));
    }, []);

    const handleCloseUpdateModal = () => {
        form.resetFields()
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
    }

    const handleProductImages = useCallback((fileList: UploadFile[]) => {
        const images: IProductImageCreate[] = fileList.map((file, index) => (
            {
                imageUrl: `/${file.url || file.name || file.originFileObj?.name || 'no-img550x750.png'}`,
                isDefault: index === 0,
            }
        )).filter(Boolean);
        form.setFieldsValue({productImages: images});
    }, []);

    const onFinish = async (value: IProduct) => {
        console.log("ShopProductGridComponent update: ", JSON.stringify(value, null, 2));
        setConfirmLoading(true);
        try {
            if (dataUpdate) {
                const data = {...value, id: dataUpdate.id};
                const result = await updateProduct(data);
                mutateProduct();
                if (result.data) {
                    handleCloseUpdateModal();
                    setConfirmLoading(false);
                    showNotification("success", {message: result.message});
                }
            }

            // refresh product màn bán hàng
            await mutate((key: any) => typeof key === 'string' && key.startsWith(URL_API_PRODUCT.filter), undefined,
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
        } finally {
            setConfirmLoading(false);
        }
    };

    return (
        <>
            <Modal title="Chỉnh sửa sản phẩm" cancelText="Hủy" okText="Lưu" style={{top: 20}} width={800}
                   open={isUpdateModalOpen}
                   onOk={() => form.submit()}
                   onCancel={() => handleCloseUpdateModal()}
                   okButtonProps={{style: {background: "#00b96b"}}}
                   confirmLoading={confirmLoading}
            >
                <Form form={form} name="updateProduct" layout="vertical" onFinish={onFinish}>
                    <Row gutter={[32, 0]} style={{marginTop: 20}}>
                        <Col span={12}>
                            <Form.Item name="productCode" label="Mã sản phẩm"
                                       tooltip="Mã sản phẩm sẽ tự động tạo nếu không nhập."
                            >
                                <Input placeholder="Mã tự động"/>
                            </Form.Item>
                            <Form.Item name="productName" label="Tên sản phẩm" validateTrigger="onBlur"
                                       rules={[{required: true, message: "Vui lòng nhập tên sản phẩm!"}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item name="genderProduct" label="Giới tính" initialValue="UNISEX">
                                <Select
                                    options={Object.keys(GENDER_PRODUCT).map((key) => (
                                        {
                                            value: key,
                                            label: GENDER_PRODUCT[key as keyof typeof GENDER_PRODUCT]
                                        }
                                    ))}
                                />
                            </Form.Item>
                            <Form.Item name="status" label="Trạng thái"
                                       rules={[{required: true, message: "Vui lòng chọn trạng thái!"}]}>
                                <Select
                                    options={(Object.keys(STATUS_PRODUCT) as Array<keyof typeof STATUS_PRODUCT>).map(
                                        (key) => (
                                            {value: key, label: STATUS_PRODUCT[key]}
                                        )
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Flex justify="space-between" align="flex-end" gap={5}>
                                <Form.Item name="categoryId" label="Danh mục" style={{width: "100%"}}
                                           validateStatus={errorDataTreeSelectCategory ? "error" : "success"}
                                           help={errorDataTreeSelectCategory ? "Error fetching categories" : ""}
                                >
                                    <TreeSelect
                                        allowClear showSearch placement="bottomLeft"
                                        placeholder={isLoadingDataTreeSelectCategory ? "Đang tải..." : "---Lựa chọn---"}
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        treeData={dataTreeSelectCategory}
                                        loading={isLoadingDataTreeSelectCategory}
                                        filterTreeNode={(search, item) => {
                                            let title = item.title?.toString() || "";
                                            return title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                                        }}

                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Tooltip placement="top" title="Thêm nhanh danh mục">
                                        <Button icon={<PlusOutlined/>} type="text" shape="circle"
                                                onClick={() => toggleCreateFastModal("category", true)}
                                        />
                                    </Tooltip>
                                </Form.Item>
                            </Flex>
                            <Flex justify="space-between" align="flex-end" gap={5}>
                                <Form.Item
                                    name="brandId" label="Thương hiệu" style={{width: "100%"}}
                                    validateStatus={errorDataOptionBrand ? "error" : "success"}
                                    help={errorDataOptionBrand ? "Error fetching brands" : ""}
                                >
                                    <SelectSearchOptionLabel
                                        data={dataOptionBrand}
                                        error={errorDataOptionBrand}
                                        isLoading={isLoadingDataOptionBrand}
                                        onChange={(value) => form.setFieldsValue({brandId: value})}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Tooltip placement="top" title="Thêm nhanh thương hiệu">
                                        <Button icon={<PlusOutlined/>} type="text" shape="circle"
                                                onClick={() => toggleCreateFastModal("brand", true)}
                                        />
                                    </Tooltip>
                                </Form.Item>
                            </Flex>
                            <Flex justify="space-between" align="flex-end" gap={5}>
                                <Form.Item name="materialId" label="Chất liệu" style={{width: "100%"}}
                                           validateStatus={errorDataOptionBrand ? "error" : "success"}
                                           help={errorDataOptionBrand ? "Error fetching brands" : ""}
                                >
                                    <SelectSearchOptionLabel
                                        data={dataOptionMaterial}
                                        error={errorDataOptionMaterial}
                                        isLoading={isLoadingDataOptionMaterial}
                                        onChange={(value) => form.setFieldsValue({materialId: value})}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Tooltip placement="top" title="Thêm nhanh chất liệu">
                                        <Button icon={<PlusOutlined/>} type="text" shape="circle"
                                                onClick={() => toggleCreateFastModal("material", true)}
                                        />
                                    </Tooltip>
                                </Form.Item>
                            </Flex>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="description" label="Mô tả sản phẩm" tooltip="Mô tả chi tiết sản phẩm">
                                <TextArea showCount maxLength={1000} style={{height: 120, resize: 'none'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: 10}}>
                        <Col span={24}>

                            <UploadImage countFileImage={6} onChange={handleProductImages}/>

                        </Col>
                    </Row>
                </Form>
            </Modal>

            <CreateCategory
                isCreateModalOpen={modalOpen.category}
                setIsCreateModalOpen={setModalOpen}
                isLoadingSelectTreeCategory={true}
                formName="createCategoryInUpdateProduct"
            />

            <CreateBrand
                isCreateModalOpen={modalOpen.brand}
                setIsCreateModalOpen={setModalOpen}
                isLoadingSelectBrand={true}
                formName="createBrandInUpdateProduct"
            />

            <CreateMaterial
                isCreateModalOpen={modalOpen.material}
                setIsCreateModalOpen={setModalOpen}
                isLoadingSelectMaterial={true}
                formName="createMaterialInUpdateProduct"
            />
        </>
    )
        ;
}
export default memo(UpdateProduct);