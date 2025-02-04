"use client"
import {
    AutoComplete, AutoCompleteProps, Button, Col, Empty, Flex, Image, Layout,
    Pagination, PaginationProps, Row, Skeleton, Space, theme, Tooltip, Typography
} from "antd";
import React, {memo, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import CheckoutComponent from "@/components/Admin/Sale/CheckoutComponent";
import {
    FilterOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import useFilterProduct, {ParamFilterProduct} from "@/components/Admin/Product/hooks/useFilterProduct";
import SubLoader from "@/components/Loader/SubLoader";
import FilterProductSale from "@/components/Admin/Sale/FilterProductSaleDrawer";
import AdminCart from "@/components/Admin/Sale/AdminCart";
import {mutate} from "swr";
import {URL_API_PRODUCT} from "@/services/ProductService";
import {HandleSale} from "@/components/Admin/Sale/SaleComponent";
import {FORMAT_NUMBER_WITH_COMMAS} from "@/constants/AppConstants";
import ProductCardView from "@/components/Admin/Sale/TypeDisplayProductListSale/ProductCardView";
import ProductListView from "@/components/Admin/Sale/TypeDisplayProductListSale/ProductListView";
import SettingViewProductList from "@/components/Admin/Sale/TypeDisplayProductListSale/SettingViewProductList";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {useDebounce} from "use-debounce";
import useCustomer from "@/components/Admin/Customer/hooks/useCustomer";
import {IOrderCreateOrUpdate} from "@/types/IOrder";


const {Content} = Layout;
const {Text, Title} = Typography;

export const defaultFilterParam: ParamFilterProduct = {
    page: 1,
    size: 20,
    category: undefined,
    gender: undefined,
    brand: undefined,
    material: undefined,
    minPrice: undefined,
    maxPrice: undefined,
};

const transformOptions = (data: ICustomer[]) => {
    return data.map((customer: ICustomer) => ({
        value: customer.id.toString(),
        label: (<Text>{`${customer.fullName} - ${customer.phoneNumber}`}</Text>),
        customer: customer
    }));
}

interface IProps {

}

const NormalSale: React.FC<IProps> = (props) => {
    const {token: {colorBgContainer, borderRadiusLG},} = theme.useToken();
    const nodeListViewModeRef = useRef(null); // ref List view hiển thị
    const elementWrapperProductListRef = useRef<HTMLDivElement>(null); // ref element bọc List view
    const [viewModeSaleProductList, setViewModeSaleProductList] = useState<string>(
        localStorage.getItem('viewModeSaleProductList') || 'list'
    );

    const handleSale = useContext(HandleSale);
    const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
    const [openDrawer, setOpenDrawer] = useState({
        checkout: false, filter: false,
    });

    const [filterParam, setFilterParam] = useState<ParamFilterProduct>({...defaultFilterParam});
    const {dataFilterProduct, isLoading} = useFilterProduct(filterParam);

    // giá trị tìm kiếm khách hàng
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debounceSearchValue] = useDebounce(searchTerm, 500);

    const {handleGetCustomers} = useCustomer();
    const {dataCustomers, isLoading: isLoadingDataOptionCustomers} = handleGetCustomers(searchTerm);

    /**
     * xử lý giá trị tìm kiếm trong input search
     */
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (value?.trim().length === 0) {
            setOptions([]);
        }
    };

    /**
     * xử lý chọn khách hàng từ AutoComplete
     */
    const handleSelect = (value: string) => {
        const selectedCustomer: ICustomer = dataCustomers?.find((customer: any) => customer.id.toString() === value);
        if (selectedCustomer) {
            handleSale?.setOrderCreateOrUpdate((prevState: IOrderCreateOrUpdate) => {
                return {
                    ...prevState,
                    customerId: Number(value)
                }
            })
            setSearchTerm(`${selectedCustomer.fullName} - ${selectedCustomer.phoneNumber}`)
        } else {
            setSearchTerm("");
            setOptions([]);
        }
    }

    /**
     * xử lý khi loại bỏ khách hàng đã chọn cho hóa đơn
     */
    const handleClearAutoCompleteSearchCustomer = () => {
        handleSale?.setOrderCreateOrUpdate((prevState: IOrderCreateOrUpdate) => {
            return {
                ...prevState,
                customerId: undefined
            }
        })
        setSearchTerm("");
        setOptions([]);
    }

    /**
     * chuyển đổi list customer thành options cho AutoComplete
     */
    const transformedOptions = useMemo(() => {
        return transformOptions(dataCustomers);
    }, [dataCustomers]);

    useEffect(() => {
        // kiểm tra 2 mảng có giống nhau không
        if (transformedOptions?.length !== options?.length) {
            setOptions(transformedOptions);
            return;
        }

        const optionsChanged = transformedOptions.some((newOption, index) => {
            return newOption.value !== options?.[index]?.value;
        });
        if (optionsChanged) setOptions(transformedOptions);

    }, [debounceSearchValue, dataCustomers]);

    /**
     * chuyển trang của sản phẩm
     * @param page
     * @param pageSize
     */
    const onChangePaginationProductList: PaginationProps['onChange'] = (page: number, pageSize: number) => {
        setFilterParam((prevValue) => ({...prevValue, page: page, size: pageSize}));
    }

    /**
     * show drawer checkout hoặc filter list product theo drawerType
     */
    const showDrawer = useCallback((drawerType: "checkout" | "filter", isOpen: boolean) => {
        setOpenDrawer((prevDrawer) => {
            return {
                ...prevDrawer,
                [drawerType]: isOpen
            }
        });
    }, []);

    /**
     * close drawer checkout hoặc filter list product theo drawerType
     */
    const onClose = useCallback((drawerType: "checkout" | "filter", isOpen: boolean) => {
        setOpenDrawer((prevDrawer) => {
            return {
                ...prevDrawer,
                [drawerType]: isOpen
            }
        });
    }, []);

    /**
     * refresh list product
     */
    const refreshDataProductList = useCallback(async () => {
        await mutate(key => typeof key === 'string' && key.startsWith(`${URL_API_PRODUCT.filter}`),
            undefined,
            {revalidate: true}
        )
    }, []);

    /**
     * scroll về đầu list khi chuyển chế độ hiển thị của list product
     */
    const scrollToTop = () => {
        if (elementWrapperProductListRef.current) {
            elementWrapperProductListRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    /**
     * scroll về đầu list product khi chuyển trang
     */
    useEffect(() => {
        scrollToTop();
    }, [filterParam.page]);

    return (
        <Layout className="px-1.5" style={{backgroundColor: colorBgContainer}}>
            <Flex gap={10} style={{height: '100%'}}>
                <div style={{width: "60%", display: "flex", flexDirection: "column", gap: 10}}>
                    <Content
                        style={{
                            borderRadius: borderRadiusLG,
                            boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)',
                            padding: "10px 10px 0px 10px",
                            overflow: "auto",
                            flexBasis: "80%",
                        }}
                    >
                        <AdminCart/>
                    </Content>

                    <Content
                        style={{
                            boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)',
                            borderRadius: borderRadiusLG,
                            padding: "10px 20px",
                            minHeight: 40,
                            flexBasis: "10%",
                            overflowY: "auto"
                        }}
                    >
                        <Flex justify="space-between" align="end" style={{width: "100%"}} wrap>
                            <Text>Ghi chú đơn hàng</Text>
                            <Flex justify="space-between" align="center" wrap>
                                <Text>
                                    <span style={{marginInlineEnd: 15}}>Tổng tiền hàng</span>
                                    <Text strong>
                                        {`${handleSale?.totalQuantityCart}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                                    </Text>
                                </Text>
                            </Flex>
                            <Text style={{fontSize: 20}} strong>
                                {`${handleSale?.totalAmountCart}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                            </Text>
                        </Flex>
                    </Content>
                </div>
                <Content
                    style={{
                        boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)',
                        borderRadius: borderRadiusLG,
                        padding: "10px 20px",
                        width: "40%",
                        overflow: "auto",
                    }}
                >
                    <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                            <div style={{flex: 1, display: 'flex', gap: 5, width: "100%"}}>
                                <AutoComplete
                                    allowClear
                                    onClear={handleClearAutoCompleteSearchCustomer}
                                    placeholder="Tìm khách hàng"
                                    suffixIcon={<SearchOutlined/>}
                                    options={options}
                                    onSearch={handleSearch}
                                    onSelect={handleSelect}
                                    value={searchTerm}
                                    style={{width: "100%", marginRight: 20}}
                                    notFoundContent={
                                        isLoading ? <Skeleton/> : (searchTerm && options?.length === 0) ?
                                            <Empty description="Không có kết quả tìm kiếm"/> : null
                                    }
                                />

                                <Button icon={<PlusOutlined/>} type="text" shape="circle"/>
                            </div>
                            <Space direction="horizontal">
                                <Tooltip placement="top" title="Làm mới sản phẩm">
                                    <Button icon={<ReloadOutlined/>} type="text" shape="circle"
                                            onClick={() => refreshDataProductList()}
                                    />
                                </Tooltip>
                                <Tooltip placement="top" title="Lọc sản phẩm">
                                    <Button icon={<FilterOutlined/>} type="text" shape="circle"
                                            onClick={() => showDrawer("filter", true)}
                                    />
                                </Tooltip>

                                {/* Change view list product */}
                                <SettingViewProductList
                                    viewMode={viewModeSaleProductList}
                                    setViewMode={setViewModeSaleProductList}
                                    scrollToTop={scrollToTop}
                                />
                            </Space>
                        </div>

                        <div ref={elementWrapperProductListRef}
                             style={{height: 'calc(100vh - 200px)', overflowY: "auto", padding: 5}}
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
                                                    responsiveImage={{xs: 24, sm: 24, md: 12, lg: 12, xl: 8, xxl: 3}}
                                                    responsiveContent={{
                                                        xs: 24,
                                                        sm: 24,
                                                        md: 12,
                                                        lg: 12,
                                                        xl: 16,
                                                        xxl: 21
                                                    }}
                                                    handleAddOrderItemCart={handleSale?.handleAddOrderItemCart ?? (() => {
                                                    })}
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
                                                    grid={{gutter: 8, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4}}
                                                    handleAddOrderItemCart={handleSale?.handleAddOrderItemCart ?? (() => {
                                                    })}
                                                />
                                            </CSSTransition>
                                        )}
                                    </TransitionGroup>
                                )
                            }
                        </div>
                        <Row gutter={[8, 8]} style={{display: "flex", alignItems: "center"}}>
                            <Col flex="1 1 200px">
                                <Pagination
                                    size="small"
                                    simple={{readOnly: true}}
                                    current={filterParam.page ?? 1}
                                    onChange={onChangePaginationProductList}
                                    showSizeChanger={false}
                                    defaultPageSize={filterParam.size ?? 20}
                                    total={dataFilterProduct?.totalElements}
                                />
                            </Col>
                            <Col flex="1 1 200px" style={{display: "flex", justifyContent: "flex-end"}}>
                                <Button size="large" type="primary" style={{width: "100%"}}
                                        onClick={() => showDrawer("checkout", true)}>
                                    TIẾN HÀNH THANH TOÁN
                                </Button>
                            </Col>
                        </Row>
                    </Space>
                </Content>
            </Flex>

            <CheckoutComponent
                customerTitleDrawer={searchTerm}
                open={openDrawer.checkout}
                onClose={onClose}
            />

            <FilterProductSale
                open={openDrawer.filter}
                onClose={() => onClose("filter", false)}
                filterParam={filterParam}
                setFilterParam={setFilterParam}
            />

        </Layout>
    )
};
export default memo(NormalSale);