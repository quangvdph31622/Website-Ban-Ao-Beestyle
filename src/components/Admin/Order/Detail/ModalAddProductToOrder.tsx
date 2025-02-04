import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {
    Button,
    Divider,
    Flex,
    Modal,
    Pagination,
    PaginationProps,
    Space,
    theme,
    Tooltip
} from "antd";
import FilterProductSale from "@/components/Admin/Sale/FilterProductSaleDrawer";
import useFilterProduct, {ParamFilterProduct} from "@/components/Admin/Product/hooks/useFilterProduct";
import {mutate} from "swr";
import {URL_API_PRODUCT} from "@/services/ProductService";
import SubLoader from "@/components/Loader/SubLoader";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import ProductListView from "@/components/Admin/Sale/TypeDisplayProductListSale/ProductListView";
import ProductCardView from "@/components/Admin/Sale/TypeDisplayProductListSale/ProductCardView";
import {IProductVariant} from "@/types/IProductVariant";
import {FilterOutlined, ReloadOutlined} from "@ant-design/icons";
import SettingViewProductList from "@/components/Admin/Sale/TypeDisplayProductListSale/SettingViewProductList";
import Search from "antd/es/input/Search";
import {SearchProps} from "antd/lib/input";

const defaultFilterParam: ParamFilterProduct = {
    page: 1,
    size: 20,
    keyword: undefined,
    category: undefined,
    gender: undefined,
    brand: undefined,
    material: undefined,
    minPrice: undefined,
    maxPrice: undefined,
};

interface IProps {
    isOpenAddProductToOrderModal: boolean;
    setOpenAddProductToOrderModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddOrderItemCart: (productVariantSelected: IProductVariant[]) => void;
}

const ModalAddProductToOrder: React.FC<IProps> = (props) => {
    const {token} = theme.useToken();
    const {isOpenAddProductToOrderModal, setOpenAddProductToOrderModal, handleAddOrderItemCart} = props;
    const nodeListViewModeRef = useRef(null); // ref List view hiển thị
    const elementWrapperProductListRef = useRef<HTMLDivElement>(null); // ref element bọc List view

    const [openDrawerFilter, setOpenDrawerFilter] = useState(false);
    const [viewModeSaleProductList, setViewModeSaleProductList] = useState<string>(
        localStorage.getItem('viewModeSaleProductList') || 'list'
    );

    const [filterParam, setFilterParam] = useState<ParamFilterProduct>({...defaultFilterParam});
    const {dataFilterProduct, isLoading} = useFilterProduct(filterParam);

    const onSearch: SearchProps['onSearch'] =
        (value, _e, info) => {
            if (info?.source === "input" && value) {
                // nếu chuỗi rỗng thì không tìm kiếm
                if (value.trim().length === 0) return;

                setFilterParam((prevValue) => {
                    return {
                        ...prevValue,
                        keyword: value.trim()
                    }
                });
            } else {
                setFilterParam((prevValue) => ({...prevValue,  keyword: value}));
            }
        }

    const onChangePaginationProductList: PaginationProps['onChange'] = (page, pageSize) => {
        setFilterParam((prevValue) => ({...prevValue, page: page, size: pageSize}));
    }

    const showDrawerFilter = useCallback(() => {
        setOpenDrawerFilter(true);
    }, []);

    const onCloseFilter = useCallback(() => {
        setOpenDrawerFilter(false);
    }, []);

    const refreshDataProductList = useCallback(async () => {
        await mutate(key =>
                typeof key === 'string' && key.startsWith(`${URL_API_PRODUCT.filter}`),
            undefined,
            {revalidate: true}
        )
    }, []);

    const scrollToTop = () => {
        if (elementWrapperProductListRef.current) {
            elementWrapperProductListRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToTop();
    }, [filterParam.page]);


    const containerStyle: React.CSSProperties = {
        position: 'relative',
        height: 200,
        padding: 48,
        overflow: 'hidden',
        background: token.colorFillAlter,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };

    return (
        <>
            <Modal
                title="Danh sách sản phẩm"
                style={{
                    top: 10
                }}
                styles={{
                    body: {
                        height: 800,
                        padding: "10px 0px"
                    }
                }}
                open={isOpenAddProductToOrderModal}
                onOk={() => setOpenAddProductToOrderModal(false)}
                onCancel={() => setOpenAddProductToOrderModal(false)}
                width={1200}
                footer={false}

            >
                <Space direction="vertical" style={{width: "100%"}}>
                    <Flex justify="space-between" gap={10} wrap>
                        <Search
                            placeholder="Theo mã, tên sản phẩm"
                            allowClear
                            onSearch={onSearch}
                            style={{width: "50%"}}
                        />

                        <Space direction="horizontal">
                            <Tooltip placement="top" title="Làm mới sản phẩm">
                                <Button icon={<ReloadOutlined/>} type="text" shape="circle"
                                        onClick={() => refreshDataProductList()}
                                />
                            </Tooltip>
                            <Tooltip placement="top" title="Lọc sản phẩm">
                                <Button icon={<FilterOutlined/>} type="text" shape="circle"
                                        onClick={() => showDrawerFilter()}
                                />
                            </Tooltip>

                            {/* Change view list product */}
                            <SettingViewProductList
                                viewMode={viewModeSaleProductList}
                                setViewMode={setViewModeSaleProductList}
                                scrollToTop={scrollToTop}
                            />
                        </Space>
                    </Flex>

                    <Divider style={{margin: "10px 0px"}}/>

                    <div ref={elementWrapperProductListRef}
                         style={{height: 680, overflowY: "auto", paddingRight: 5}}
                    >
                        {
                            isLoading ? (
                                <SubLoader size="small" spinning={isLoading}/>
                            ) : (
                                <TransitionGroup>
                                    {viewModeSaleProductList === 'list' ? (
                                        <CSSTransition
                                            key="list"
                                            timeout={300}
                                            classNames="fade"
                                            nodeRef={nodeListViewModeRef}
                                        >
                                            <ProductListView
                                                dataSource={dataFilterProduct?.items}
                                                nodeRef={nodeListViewModeRef}
                                                responsiveImage={{xs: 24, sm: 12, md: 3, lg: 3, xl: 3, xxl: 3}}
                                                responsiveContent={{xs: 24, sm: 12, md: 21, lg: 21, xl: 21, xxl: 21}}
                                                handleAddOrderItemCart={handleAddOrderItemCart}

                                            />
                                        </CSSTransition>
                                    ) : (
                                        <CSSTransition
                                            key="grid"
                                            timeout={300}
                                            classNames="fade"
                                            nodeRef={nodeListViewModeRef}
                                        >
                                            <ProductCardView
                                                dataSource={dataFilterProduct?.items}
                                                nodeRef={nodeListViewModeRef}
                                                grid={{gutter: 8, xs: 1, sm: 3, md: 4, lg: 5, xl: 5, xxl: 6}}
                                                handleAddOrderItemCart={handleAddOrderItemCart}
                                            />
                                        </CSSTransition>
                                    )}
                                </TransitionGroup>
                            )
                        }
                    </div>


                    <Flex align="center" justify="center" style={{padding: 20}}>
                        <Pagination
                            simple={{readOnly: true}}
                            current={filterParam.page ?? 1}
                            onChange={onChangePaginationProductList}
                            showSizeChanger={false}
                            defaultPageSize={filterParam.size ?? 20}
                            total={dataFilterProduct?.totalElements}
                        />
                    </Flex>
                </Space>
            </Modal>

            <FilterProductSale
                open={openDrawerFilter}
                onClose={() => onCloseFilter()}
                filterParam={filterParam}
                setFilterParam={setFilterParam}
            />
        </>
    )
}
export default memo(ModalAddProductToOrder);