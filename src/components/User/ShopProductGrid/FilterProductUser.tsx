"use client";
import React, {memo, useState} from "react";
import {
    Checkbox,
    Col,
    Divider,
    Flex,
    type GetProp,
    Radio,
    RadioChangeEvent,
    Row,
    Tree, TreeProps,
    Typography
} from "antd";
import {ParamFilterProduct} from "@/components/Admin/Product/hooks/useFilterProduct";
import SliderPriceProduct from "@/components/Slider/SliderPriceProduct";
import {GENDER_PRODUCT} from "@/constants/GenderProduct";
import useCategory from "@/components/Admin/Category/hooks/useCategory";
import useBrand from "@/components/Admin/Brand/hooks/useBrand";
import useMaterial from "@/components/Admin/Material/hooks/useMaterial";
import {CloseOutlined, DownOutlined} from "@ant-design/icons";

const {Text, Title} = Typography;

interface IProps {
    title?: string;
    filterParam: ParamFilterProduct;
    setFilterParam: React.Dispatch<React.SetStateAction<ParamFilterProduct>>;
}

const FilterProductUser: React.FC<IProps> = (props) => {
    const {filterParam, setFilterParam} = props;

    const {dataTreeSelectCategory, error: errorDataCategory, isLoading: isLoadingDataCategory}
        = useCategory(true);
    const {dataBrand, error: errorDataOptionBrand, isLoading: isLoadingDataOptionBrand}
        = useBrand(true);
    const {dataMaterial, error: errorDataOptionMaterial, isLoading: isLoadingDataOptionMaterial}
        = useMaterial(true);

    // State cho mỗi nhóm checkbox
    const [selectedCategoryKeys, setSelectedCategoryKeys] = useState<React.Key[]>([]);
    const [checkedBrands, setCheckedBrands] = useState<string[]>([]);
    const [checkedMaterials, setCheckedMaterials] = useState<string[]>([]);
    const [resetSliderRangePrice, setResetSliderRangePrice] = useState<boolean>(false);

    // const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [showMoreBrands, setShowMoreBrands] = useState(false);
    const [showMoreMaterials, setShowMoreMaterials] = useState(false);

    const onChangeGenderProductFilter = (e: RadioChangeEvent) => {
        const {value} = e.target;
        // console.log('GenderProductFilter', value)
        setFilterParam((prevValue) => ({...prevValue, gender: value ? value : undefined}));
    };


    const onSelectCategory: TreeProps['onSelect'] = (selectedKeysValue, info) => {
        // console.log(selectedKeysValue)
        setSelectedCategoryKeys(selectedKeysValue);
        if (selectedKeysValue.length > 0) {
            setFilterParam((prevValue) => {
                return {
                    ...prevValue,
                    category: selectedKeysValue.toString()
                }
            });
        }
    };

    const onChangeBrandFilter: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any[]) => {
        // console.log('BrandFilter', checkedValues)
        setCheckedBrands(checkedValues);
        if (checkedValues.length > 0 && checkedValues.length < dataBrand.length) {
            setFilterParam((prevValue) => {
                return {
                    ...prevValue,
                    brand: checkedValues.toString()
                }
            });
        } else {
            setFilterParam((prevValue) => ({...prevValue, brand: undefined}));
        }
    };

    const onChangeMaterialFilter: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any[]) => {
        // console.log('MaterialFilter', checkedValues)
        setCheckedMaterials(checkedValues);
        if (checkedValues.length > 0 && checkedValues.length < dataMaterial.length) {
            setFilterParam((prevValue) => {
                return {
                    ...prevValue,
                    material: checkedValues.toString()
                }
            });
        } else {
            setFilterParam((prevValue) => ({...prevValue, material: undefined}));
        }
    };

    const handleRemoveAllCheckList = () => {
        // console.log('tempFilterParam', tempFilterParam)
        setResetSliderRangePrice(true);
        setSelectedCategoryKeys([]);
        setCheckedBrands([]);
        setCheckedMaterials([]);
        setFilterParam({
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

    return (
        <>
            <Flex justify="space-between" align="end" style={{margin: 5}}>
                <Title style={{margin: 0, marginInlineEnd: 10}} level={3}>Bộ lọc</Title>
                {
                    (filterParam.category || filterParam.gender || filterParam.brand ||
                        filterParam.material || filterParam.minPrice || filterParam.maxPrice) &&
                    <Text className="clear-filter-product-user">
                        <CloseOutlined style={{marginInlineEnd: 10}} onClick={handleRemoveAllCheckList}/>
                        Xóa hết
                    </Text>
                }
            </Flex>
            <Divider/>

            {/* Lọc danh mục */}
            <Title level={5} style={{marginBottom: 10}}>Danh mục sản phẩm</Title>
            <Tree
                blockNode
                switcherIcon={<DownOutlined/>}
                selectedKeys={selectedCategoryKeys}
                onSelect={onSelectCategory}
                treeData={dataTreeSelectCategory}
                height={400}
                style={{maxWidth: '100%'}}
            />
            <Divider/>

            {/* Khoảng giá*/}
            <Title level={5} style={{marginBottom: 10}}>Khoảng giá</Title>
            <Flex style={{marginBottom: 10}}>
                <SliderPriceProduct
                    setTempFilterParam={setFilterParam}
                    reset={resetSliderRangePrice}
                    setReset={setResetSliderRangePrice}
                    style={{width: "95%"}}
                />
            </Flex>
            <Divider/>

            {/* Lọc giới tính*/}
            <Title level={5} style={{marginBottom: 10}}>Giới tính</Title>
            <Radio.Group onChange={onChangeGenderProductFilter} value={filterParam?.gender}>
                <Row gutter={[8, 8]}>
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

            {/* Lọc thương hiệu */}
            <Title level={5} style={{marginBottom: 10}}>Thương hiệu</Title>
            <Checkbox.Group value={checkedBrands} onChange={onChangeBrandFilter}>
                <Row gutter={[16, 16]}>
                    {dataBrand?.slice(0, showMoreBrands ? dataBrand.length : 6).map((item: any) => (
                        <Col key={item.id}>
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
        </>
    );
};

export default memo(FilterProductUser);
