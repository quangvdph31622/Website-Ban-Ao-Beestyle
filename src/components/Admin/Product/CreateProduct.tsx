"use client"
import {
    Button,
    Col, Collapse, Flex, Form, Input, InputNumber, Modal, Row, Select,
    Tabs, TabsProps, Tooltip, TreeSelect, Typography, UploadFile
} from "antd";
import useAppNotifications from "@/hooks/useAppNotifications";
import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { IProductCreate } from "@/types/IProduct";
import UploadImage from "@/components/Upload/UploadImage";
import SelectSearchOptionLabel from "@/components/Select/SelectSearchOptionLabel";
import useMaterial from "@/components/Admin/Material/hooks/useMaterial";
import useBrand from "@/components/Admin/Brand/hooks/useBrand";
import { GENDER_PRODUCT } from "@/constants/GenderProduct";
import useCategory from "@/components/Admin/Category/hooks/useCategory";
import TableEditRows from "@/components/Admin/Product/CreateProductVariantTable";
import ColorOptionSelect from "@/components/Select/ColorOptionSelect";
import { IProductImageCreate } from "@/types/IProductImage";
import { IProductVariantCreate, IProductVariantRows } from "@/types/IProductVariant";
import SizeOptionSelect from "@/components/Select/SizeOptionSelect";
import TextArea from "antd/es/input/TextArea";
import { useDebounce } from "use-debounce";
import useOptionColor from "@/components/Admin/Color/hooks/useOptionColor";
import useOptionSize from "@/components/Admin/Size/hooks/useOptionSize";
import { PlusOutlined } from "@ant-design/icons";
import CreateCategory from "@/components/Admin/Category/CreateCategory";
import CreateBrand from "@/components/Admin/Brand/CreateBrand";
import CreateMaterial from "@/components/Admin/Material/CreateMaterial";
import CreateColor from "@/components/Admin/Color/CreateColor";
import CreateSize from "@/components/Admin/Size/CreateSize";
import { createProduct } from "@/services/ProductService";
import { FORMAT_NUMBER_WITH_COMMAS } from "@/constants/AppConstants";
import { RcFile } from "antd/es/upload/interface";

const { Title } = Typography;

type CreateFastModalType = "category" | "material" | "brand" | "color" | "size";

const URL_UPLOAD_IMAGE = 'https://api.cloudinary.com/v1_1/du7lpbqc2/image/upload';

// Các định dạng ảnh được phép upload
const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
];

const generateProductVariants = (
    colors: { value: number; label: string }[],
    sizes: { value: number; label: string }[],
    originalPrice: number = 0,
    salePrice: number = 0,
    quantityInStock: number = 0,
) => {
    const timestamp = Date.now();
    return colors.flatMap((color, index) =>
        sizes.map((size) => ({
            key: `${color.value}-${size.value}`,
            sku: `SKU${timestamp}-${Math.floor(Math.random() * 10000)}`,
            productVariantName: `${color.label} - ${size.label}`,
            colorId: color.value,
            sizeId: size.value,
            originalPrice: originalPrice,
            salePrice: salePrice,
            quantityInStock: quantityInStock,
        }))
    );
};

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (value: boolean) => void;
    mutate: any
}

const CreateProduct = (props: IProps) => {
    const [form] = Form.useForm();
    const { showNotification } = useAppNotifications();
    const { isCreateModalOpen, setIsCreateModalOpen, mutate } = props;

    const [filesUploadCloudinary, setFilesUploadCloudinary] = useState<RcFile[]>([]);
    const [activeKeyCollapse, setActiveKeyCollapse] = useState<string[]>([]);
    const [productVariantRows, setProductVariantRows] = useState<IProductVariantRows[]>([]);
    const [selectedColors, setSelectedColors] = useState<{ value: number; label: any }[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<{ value: number; label: any }[]>([]);
    const [productPricingAndStock, setProductPricingAndStock] = useState({
        originalPrice: null, salePrice: null, quantityInStock: null,
    });
    const [debouncedPricingAndStockVariant] = useDebounce(productPricingAndStock, 1000);
    const [modalOpen, setModalOpen] = useState({
        category: false, material: false, brand: false, color: false, size: false,
    });
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { dataOptionBrand, error: errorDataOptionBrand, isLoading: isLoadingDataOptionBrand }
        = useBrand(isCreateModalOpen);
    const { dataTreeSelectCategory, error: errorDataTreeSelectCategory, isLoading: isLoadingDataTreeSelectCategory }
        = useCategory(isCreateModalOpen);
    const { dataOptionMaterial, error: errorDataOptionMaterial, isLoading: isLoadingDataOptionMaterial }
        = useMaterial(isCreateModalOpen);
    const { dataOptionColor, error: errorDataOptionColor, isLoading: isLoadingDataOptionColor }
        = useOptionColor(isCreateModalOpen);
    const { dataOptionSize, error: errorDataOptionSize, isLoading: isLoadingDataOptionSize }
        = useOptionSize(isCreateModalOpen);

    const handleCloseCreateModal = () => {
        form.resetFields();
        setActiveKeyCollapse([]);
        setProductVariantRows([]);
        setSelectedColors([]);
        setSelectedSizes([]);
        setFilesUploadCloudinary([]);
        setProductPricingAndStock({ originalPrice: null, salePrice: null, quantityInStock: null, });
        setIsCreateModalOpen(false);
    };

    const toggleCreateFastModal = useCallback((modalType: CreateFastModalType, isOpen: boolean) => {
        setModalOpen((prevModals) => ({ ...prevModals, [modalType]: isOpen }));
    }, []);


    const handleSelectChange = (type: 'colors' | 'sizes', selectedOptions: { value: number; label: string }[]) => {
        if (type === 'colors') {
            setSelectedColors(selectedOptions);
        } else {
            setSelectedSizes(selectedOptions);
        }
    }

    const handleInputChangePricingAndStock = (field: 'originalPrice' | 'salePrice' | 'quantityInStock',
        value: number | null = 0) => {
        setProductPricingAndStock((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const handleCollapseChange = (key: string | string[]) => {
        if (key.includes('thuoc-tinh')) {
            setActiveKeyCollapse(['thuoc-tinh', 'danh-sach-san-pham-cung-loai']);
        } else {
            setActiveKeyCollapse(key as string[]);
        }
    };

    /**
     * xử lý thêm ảnh
     */
    const handleChangeProductImages = async (fileList: UploadFile[]) => {
        if (fileList.length === 0) return;

        // validate phải là file ảnh
        const validUploadFiles: RcFile[] = fileList
            .filter((file) => file.originFileObj && allowedTypes.includes(file.originFileObj.type))
            .map((file) => file.originFileObj)
            .filter((file): file is RcFile => file !== undefined);

        // k có file nào thỏa mãn thì không hiển thị
        if (validUploadFiles.length === 0) return;

        console.log(validUploadFiles);
        setFilesUploadCloudinary(validUploadFiles);
    }

    /**
     * upload ảnh lên cloudinary
     * @param fileUpLoad
     */
    const uploadImagesCloudinary = async (fileUpLoad: RcFile[]): Promise<IProductImageCreate[]> => {
        try {

            // upload image lên cloudinary
            const uploadPromises = fileUpLoad.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "beestyle_images");

                const response = await fetch(URL_UPLOAD_IMAGE, { method: "POST", body: formData });

                if (response.ok) {
                    const data = await response.json();
                    return data.secure_url;
                } else {
                    const errorData = await response.json();
                    showNotification("error", {
                        message: "Upload ảnh thất bại!",
                        description: errorData.error?.message || "Lỗi khi tải hình ảnh."
                    });
                    return null;
                }
            });

            const urls = (await Promise.all(uploadPromises)).filter((url): url is string => url !== null);

            console.log("urls", urls);

            return urls.map((url: string, index: number) => ({
                imageUrl: url,
                isDefault: index === 0,
            }));
        } catch (error) {
            showNotification("error", { message: "Lỗi khi upload ảnh!" });
            return [];
        }
    }

    useEffect(() => {
        if (selectedColors.length > 0 || selectedSizes.length > 0) {
            const variants = generateProductVariants(
                selectedColors,
                selectedSizes,
                debouncedPricingAndStockVariant.originalPrice ?? 0,
                debouncedPricingAndStockVariant.salePrice ?? 0,
                debouncedPricingAndStockVariant.quantityInStock ?? 0,
            );
            setProductVariantRows(variants);
        }
    }, [selectedColors, selectedSizes, debouncedPricingAndStockVariant]);

    useLayoutEffect(() => {
        if (!isCreateModalOpen) {
            setActiveKeyCollapse([]);
        }
    }, [isCreateModalOpen]);

    /**
     * thêm sản phẩm vào db
     * @param value
     */
    const onFinish = async (value: IProductCreate) => {
        // map các biến thể của sản phẩm
        const productVariants: IProductVariantCreate[] = productVariantRows.map(({
            key,
            productVariantName,
            ...rest
        }) => rest);


        setConfirmLoading(true);
        try {
            const uploadedImages: IProductImageCreate[] = await uploadImagesCloudinary(filesUploadCloudinary);

            const product: IProductCreate = {
                ...value,
                productImages: uploadedImages,
                productVariants
            };

            console.log('Success json:', JSON.stringify(product, null, 2));

            const result = await createProduct(product);
            mutate();
            if (result.data) {
                handleCloseCreateModal();
                setConfirmLoading(false);
                showNotification("success", { message: result.message });
            }
        } catch (error: any) {
            setConfirmLoading(false);
            const errorMessage = error?.response?.data?.message;
            if (errorMessage && typeof errorMessage === 'object') {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", { message: String(message) });
                });
            } else {
                showNotification("error", { message: error?.message, description: errorMessage, });
            }
        }
    }

    const itemTabs: TabsProps['items'] = [
        {
            key: "info",
            label: "Thông tin",
            children: (
                <>
                    <Row gutter={[32, 0]} style={{ margin: "10px 0px" }}>
                        <Col span={12}>
                            <Form.Item
                                name="productCode"
                                label="Mã sản phẩm"
                                tooltip="Mã sản phẩm sẽ tự động tạo nếu không nhập."
                            >
                                <Input placeholder="Mã tự động" />
                            </Form.Item>
                            <Form.Item
                                name="productName"
                                label="Tên sản phẩm"
                                validateTrigger="onBlur"
                                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                            >
                                <Input />
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
                        </Col>
                        <Col span={12}>
                            <Flex justify="space-between" align="flex-end" gap={5}>
                                <Form.Item
                                    name="categoryId" label="Danh mục" style={{ width: "100%" }}
                                    validateStatus={errorDataTreeSelectCategory ? "error" : "success"}
                                    help={errorDataTreeSelectCategory ? "Error fetching categories" : ""}
                                >
                                    <TreeSelect
                                        allowClear showSearch placement="bottomLeft"
                                        placeholder={isLoadingDataTreeSelectCategory ? "Đang tải..." : "---Lựa chọn---"}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
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
                                        <Button
                                            icon={<PlusOutlined />}
                                            type="text"
                                            shape="circle"
                                            onClick={() => toggleCreateFastModal("category", true)}
                                        />
                                    </Tooltip>
                                </Form.Item>
                            </Flex>
                            <Form.Item
                                name="brandId" label="Thương hiệu"
                                validateStatus={errorDataOptionBrand ? "error" : "success"}
                                help={errorDataOptionBrand ? "Error fetching brands" : ""}
                            >
                                <Flex justify="space-between" align="center" gap={5}>
                                    <SelectSearchOptionLabel
                                        data={dataOptionBrand}
                                        error={errorDataOptionBrand}
                                        isLoading={isLoadingDataOptionBrand}
                                        onChange={(value) => form.setFieldsValue({ brandId: value })}
                                    />
                                    <Tooltip placement="top" title="Thêm nhanh thương hiệu">
                                        <Button
                                            icon={<PlusOutlined />}
                                            type="text"
                                            shape="circle"
                                            onClick={() => toggleCreateFastModal("brand", true)}
                                        />
                                    </Tooltip>
                                </Flex>
                            </Form.Item>
                            <Form.Item
                                name="materialId" label="Chất liệu"
                                validateStatus={errorDataOptionBrand ? "error" : "success"}
                                help={errorDataOptionBrand ? "Error fetching brands" : ""}
                            >
                                <Flex justify="space-between" align="center" gap={5}>
                                    <SelectSearchOptionLabel
                                        data={dataOptionMaterial}
                                        error={errorDataOptionMaterial}
                                        isLoading={isLoadingDataOptionMaterial}
                                        onChange={(value) => form.setFieldsValue({ materialId: value })}
                                    />
                                    <Tooltip placement="top" title="Thêm nhanh chất liệu">
                                        <Button
                                            icon={<PlusOutlined />}
                                            type="text"
                                            shape="circle"
                                            onClick={() => toggleCreateFastModal("material", true)}
                                        />
                                    </Tooltip>
                                </Flex>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ margin: "0px 20px" }}>
                        <Col span={24}>
                            <Flex align="center" gap={70}>
                                <Form.Item label="Giá vốn" initialValue={0} layout="horizontal">
                                    <InputNumber<number>
                                        style={{ width: '100%' }} min={0} placeholder={"0"}
                                        formatter={(value) => `${value}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                                        value={productPricingAndStock.originalPrice}
                                        onChange={(value) => handleInputChangePricingAndStock("originalPrice", value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Giá bán" initialValue={0} layout="horizontal">
                                    <InputNumber<number>
                                        style={{ width: '100%' }} min={0} placeholder={"0"}
                                        formatter={(value) => `${value}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                                        value={productPricingAndStock.salePrice}
                                        onChange={(value) => handleInputChangePricingAndStock("salePrice", value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Tồn kho" initialValue={0} layout="horizontal">
                                    <InputNumber<number>
                                        style={{ width: '100%' }} min={0} placeholder={"0"}
                                        formatter={(value) => `${value}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                                        value={productPricingAndStock.quantityInStock}
                                        onChange={(value) => handleInputChangePricingAndStock("quantityInStock", value)}
                                    />
                                </Form.Item>
                            </Flex>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ margin: "10px 0px" }}>

                            <UploadImage countFileImage={6} onChange={handleChangeProductImages} />

                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Collapse
                                activeKey={activeKeyCollapse}
                                onChange={handleCollapseChange}
                                collapsible="icon"
                                size="small" expandIconPosition="end"
                                items={[{
                                    key: 'thuoc-tinh',
                                    label: <Title level={5} style={{ margin: '0px 10px' }}>Thuộc tính</Title>,
                                    children: (
                                        <>
                                            <Flex vertical gap={16}>
                                                <div>
                                                    <Typography.Title level={5}>Màu sắc:</Typography.Title>
                                                    <Flex justify="space-between" align="center" gap={5}>
                                                        <ColorOptionSelect
                                                            data={dataOptionColor}
                                                            error={errorDataOptionColor}
                                                            isLoading={isLoadingDataOptionColor}
                                                            selectedValues={selectedColors}
                                                            onChange={
                                                                (selectedOptions: {
                                                                    value: number;
                                                                    label: string
                                                                }[]) => {
                                                                    handleSelectChange("colors", selectedOptions);
                                                                }}
                                                            onClear={() => {
                                                                setSelectedColors([]);
                                                                setProductVariantRows([]);
                                                            }}
                                                        />
                                                        <Tooltip placement="top" title="Thêm nhanh màu sắc">
                                                            <Button
                                                                icon={<PlusOutlined />}
                                                                type="text"
                                                                shape="circle"
                                                                onClick={() => toggleCreateFastModal("color", true)}
                                                            />
                                                        </Tooltip>
                                                    </Flex>
                                                </div>
                                                <div>
                                                    <Typography.Title level={5}>Kích cỡ</Typography.Title>
                                                    <Flex justify="space-between" align="center" gap={5}>
                                                        <SizeOptionSelect
                                                            data={dataOptionSize}
                                                            error={errorDataOptionSize}
                                                            isLoading={isLoadingDataOptionSize}
                                                            selectedValues={selectedSizes}
                                                            onChange={
                                                                (selectedOptions: {
                                                                    value: number;
                                                                    label: string
                                                                }[]) => {
                                                                    handleSelectChange("sizes", selectedOptions);
                                                                }
                                                            }
                                                            onClear={() => {
                                                                setSelectedSizes([])
                                                                setProductVariantRows([]);
                                                            }}
                                                        />
                                                        <Tooltip placement="top" title="Thêm nhanh kích cỡ">
                                                            <Button
                                                                icon={<PlusOutlined />}
                                                                type="text"
                                                                shape="circle"
                                                                onClick={() => toggleCreateFastModal("size", true)}
                                                            />
                                                        </Tooltip>
                                                    </Flex>
                                                </div>
                                            </Flex>
                                        </>
                                    )
                                }]}
                            />
                        </Col>
                    </Row>
                    <Row style={{ margin: "10px 0px" }}>
                        <Col span={24}>
                            <Collapse
                                size="small" expandIconPosition="end" collapsible="icon"
                                activeKey={activeKeyCollapse}
                                onChange={handleCollapseChange}
                                items={[{
                                    key: 'danh-sach-san-pham-cung-loai',
                                    label: (
                                        <Title level={5} style={{ margin: '0px 10px' }}>
                                            Danh sách sản phẩm cùng loại
                                        </Title>),
                                    children: (
                                        <Form.Item name="productVariants">
                                            <TableEditRows
                                                productVariantRows={productVariantRows}
                                                setProductVariantRows={setProductVariantRows}
                                            />
                                        </Form.Item>
                                    )
                                }]}
                            />
                        </Col>
                    </Row>
                </>
            ),
        },
        {
            key: "description-detail",
            label: "Mô tả chi tiết",
            children: (
                <>
                    <Row style={{ margin: "10px 0px" }}>
                        <Col span={24}>
                            <Form.Item name="description" label="Mô tả sản phẩm"
                                tooltip="Mô tả chi tiết sản phẩm"
                            >
                                <TextArea showCount maxLength={1100} style={{ height: 120, resize: 'none' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </>
            )
        },
    ];

    return (
        <>
            <Modal
                title="Thêm sản phẩm" cancelText="Hủy" okText="Lưu" width={1000} style={{ top: 20 }}
                maskClosable={false}
                open={isCreateModalOpen}
                onOk={() => form.submit()}
                onCancel={() => handleCloseCreateModal()}
                okButtonProps={{ style: { background: "#00b96b" } }}
                confirmLoading={confirmLoading}
            >
                <Form form={form} name="createProduct" onFinish={onFinish}
                    labelAlign="left" labelWrap layout="vertical"
                >
                    <Tabs defaultActiveKey="info" items={itemTabs} />
                </Form>
            </Modal>

            <CreateCategory
                isCreateModalOpen={modalOpen.category}
                setIsCreateModalOpen={setModalOpen}
                isLoadingSelectTreeCategory={true}
                formName="createCategoryInCreateProduct"
            />

            <CreateBrand
                isCreateModalOpen={modalOpen.brand}
                setIsCreateModalOpen={setModalOpen}
                isLoadingSelectBrand={true}
                formName="createBrandInCreateProduct"
            />

            <CreateMaterial
                isCreateModalOpen={modalOpen.material}
                setIsCreateModalOpen={setModalOpen}
                isLoadingSelectMaterial={true}
                formName="createMaterialInCreateProduct"
            />

            <CreateColor
                isCreateModalOpen={modalOpen.color}
                setIsCreateModalOpen={setModalOpen}
                isLoadingSelectColor={true}
            />

            <CreateSize
                isCreateModalOpen={modalOpen.size}
                setIsCreateModalOpen={setModalOpen}
                isLoadingSelectSize={true}
            />
        </>
    );
}
export default memo(CreateProduct);
