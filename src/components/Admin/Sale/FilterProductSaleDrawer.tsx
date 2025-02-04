import {
    Button,
    Checkbox,
    Col,
    Divider,
    Drawer,
    Flex,
    type GetProp,
    Radio,
    RadioChangeEvent,
    Row,
    Typography
} from "antd";
import React, {memo, useState} from "react";
import {GENDER_PRODUCT} from "@/constants/GenderProduct";
import useCategory from "@/components/Admin/Category/hooks/useCategory";
import useBrand from "@/components/Admin/Brand/hooks/useBrand";
import useMaterial from "@/components/Admin/Material/hooks/useMaterial";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {ParamFilterProduct} from "@/components/Admin/Product/hooks/useFilterProduct";
import SliderPriceProduct from "@/components/Slider/SliderPriceProduct";

const {Title} = Typography;

interface IProps {
    title?: string;
    open: boolean;
    onClose: () => void;
    filterParam: ParamFilterProduct;
    setFilterParam: (value: ParamFilterProduct) => void;
    getContainer?: any;
}

const FilterProductSaleDrawer: React.FC<IProps> = (props) => {
    const {open, onClose, filterParam, setFilterParam} = props;
    const [tempFilterParam, setTempFilterParam] = useState<ParamFilterProduct>(filterParam);

    const {dataCategory, error: errorDataTreeSelectCategory, isLoading: isLoadingDataTreeSelectCategory}
        = useCategory(true);
    const {dataBrand, error: errorDataOptionBrand, isLoading: isLoadingDataOptionBrand}
        = useBrand(true);
    const {dataMaterial, error: errorDataOptionMaterial, isLoading: isLoadingDataOptionMaterial}
        = useMaterial(true);

    // State cho mỗi nhóm checkbox
    const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
    const [checkedBrands, setCheckedBrands] = useState<string[]>([]);
    const [checkedMaterials, setCheckedMaterials] = useState<string[]>([]);
    const [resetSliderRangePrice, setResetSliderRangePrice] = useState<boolean>(false);

    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [showMoreBrands, setShowMoreBrands] = useState(false);
    const [showMoreMaterials, setShowMoreMaterials] = useState(false);

    const onChangeGenderProductFilter = (e: RadioChangeEvent) => {
        const {value} = e.target;
        // console.log('GenderProductFilter', value)
        setTempFilterParam((prevValue) => ({...prevValue, gender: value ? value : undefined}));
    };

    const onChangeCategoryFilter: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any[]) => {
        // console.log('CategoryFilter', checkedValues)
        setCheckedCategories(checkedValues);
        if (checkedValues.length > 0 && checkedValues.length < dataCategory.length) {
            setTempFilterParam((prevValue) => {
                return {
                    ...prevValue,
                    category: checkedValues.toString()
                }
            });
        } else {
            setTempFilterParam((prevValue) => ({...prevValue, category: undefined}));
        }
    };

    const onChangeBrandFilter: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any[]) => {
        // console.log('BrandFilter', checkedValues)
        setCheckedBrands(checkedValues);
        if (checkedValues.length > 0 && checkedValues.length < dataBrand.length) {
            setTempFilterParam((prevValue) => {
                return {
                    ...prevValue,
                    brand: checkedValues.toString()
                }
            });
        } else {
            setTempFilterParam((prevValue) => ({...prevValue, brand: undefined}));
        }
    };

    const onChangeMaterialFilter: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any[]) => {
        // console.log('MaterialFilter', checkedValues)
        setCheckedMaterials(checkedValues);
        if (checkedValues.length > 0 && checkedValues.length < dataMaterial.length) {
            setTempFilterParam((prevValue) => {
                return {
                    ...prevValue,
                    material: checkedValues.toString()
                }
            });
        } else {
            setTempFilterParam((prevValue) => ({...prevValue, material: undefined}));
        }
    };

    const handleClearAllFilter = () => {
        // console.log('tempFilterParam', tempFilterParam)
        setResetSliderRangePrice(true);
        setCheckedCategories([]);
        setCheckedBrands([]);
        setCheckedMaterials([]);
        setTempFilterParam({
            page: 1,
            size: 20,
            category: undefined,
            gender: undefined,
            brand: undefined,
            material: undefined,
            minPrice: undefined,
            maxPrice: undefined,
        })
    }

    const handleOk = () => {
        onClose();
        setFilterParam(tempFilterParam);
    }

    const footerDrawer = (
        <Flex justify="space-between" align="center" style={{padding: "10px 0px"}}>
            <Button size="large" onClick={handleClearAllFilter}>Xóa tất cả</Button>
            <Button size="large" type="primary" onClick={handleOk}>Xem kết quả</Button>
        </Flex>
    );

    return (
        <>
            <Drawer
                title={
                    <Flex justify="space-between" align="center" style={{width: "100%"}} wrap>
                        <div>
                            <Title level={4} style={{margin: 0}}>Lọc sản phẩm</Title>
                        </div>
                        <div>
                            <Button onClick={onClose} type="text" icon={<CloseIcon/>}/>
                        </div>
                    </Flex>
                }
                width={500}
                onClose={onClose}
                open={open}
                footer={footerDrawer}
                closable={false}
                styles={{
                    header: {padding: '10px 24px'}
                }}

            >
                {/* Khoảng giá*/}
                <Title level={5} style={{marginBottom: 10}}>Khoảng giá</Title>
                <Flex style={{marginBottom: 10}}>
                    <SliderPriceProduct
                        setTempFilterParam={setTempFilterParam}
                        reset={resetSliderRangePrice}
                        setReset={setResetSliderRangePrice}
                        style={{width: "95%"}}
                    />
                </Flex>
                <Divider/>

                {/* Lọc giới tính*/}
                <Title level={5} style={{marginBottom: 10}}>Giới tính</Title>
                <Radio.Group onChange={onChangeGenderProductFilter} value={tempFilterParam.gender}>
                    <Row gutter={[16, 16]}>
                        <Col key={"ALL"}>
                            <Radio value={undefined}>Tất cả</Radio>
                        </Col>
                        {Object.keys(GENDER_PRODUCT).map((key) => (
                            <Col key={key}>
                                <Radio value={key}>
                                    {GENDER_PRODUCT[key as keyof typeof GENDER_PRODUCT]}
                                </Radio>
                            </Col>
                        ))}
                    </Row>
                </Radio.Group>
                <Divider/>

                {/* Lọc danh mục */}
                <Title level={5} style={{marginBottom: 10}}>Danh mục</Title>
                <Checkbox.Group value={checkedCategories} onChange={onChangeCategoryFilter}>
                    <Row gutter={[8, 8]}>
                        {dataCategory.slice(0, showMoreCategories ? dataCategory.length : 6).map((item: any) => (
                            <Col key={item.id} span={12}>
                                <Checkbox value={item.id}>
                                    {item.categoryName}
                                </Checkbox>
                            </Col>
                        ))}
                    </Row>
                </Checkbox.Group>
                <div
                    style={{cursor: 'pointer', color: '#1890ff', marginTop: 10}}
                    onClick={() => setShowMoreCategories(!showMoreCategories)}
                >
                    {showMoreCategories ? 'Thu gọn' : 'Xem thêm'}
                </div>
                <Divider/>

                {/* Lọc thương hiệu */}
                <Title level={5} style={{marginBottom: 10}}>Thương hiệu</Title>
                <Checkbox.Group value={checkedBrands} onChange={onChangeBrandFilter}>
                    <Row gutter={[8, 8]}>
                        {dataBrand?.slice(0, showMoreBrands ? dataBrand.length : 6).map((item: any) => (
                            <Col key={item.id} span={12}>
                                <Checkbox value={item.id}>
                                    {item.brandName}
                                </Checkbox>
                            </Col>
                        ))}
                    </Row>
                </Checkbox.Group>
                <div
                    style={{cursor: 'pointer', color: '#1890ff', marginTop: 10}}
                    onClick={() => setShowMoreBrands(!showMoreBrands)}
                >
                    {showMoreBrands ? 'Thu gọn' : 'Xem thêm'}
                </div>
                <Divider/>

                {/* Lọc chất liệu */}
                <Title level={5} style={{marginBottom: 10}}>Chất liệu</Title>
                <Checkbox.Group value={checkedMaterials} onChange={onChangeMaterialFilter}>
                    <Row gutter={[16, 16]}>
                        {dataMaterial.slice(0, showMoreMaterials ? dataMaterial.length : 6).map((item: any) => (
                            <Col key={item.id}>
                                <Checkbox value={item.id}>
                                    {item.materialName}
                                </Checkbox>
                            </Col>
                        ))}
                    </Row>
                </Checkbox.Group>
                <div
                    style={{cursor: 'pointer', color: '#1890ff', marginTop: 10}}
                    onClick={() => setShowMoreMaterials(!showMoreMaterials)}
                >
                    {showMoreMaterials ? 'Thu gọn' : 'Xem thêm'}
                </div>
            </Drawer>
        </>
    );
}
export default memo(FilterProductSaleDrawer);