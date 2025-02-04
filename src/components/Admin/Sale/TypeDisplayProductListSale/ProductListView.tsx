import {Card, Flex, List, Typography, Image, Row, Col} from "antd";
import React, {memo, useContext, useState} from "react";
import ModalListProductVariant from "@/components/Admin/Sale/ModalListProductVariant";
import {IProduct} from "@/types/IProduct";
import {FORMAT_NUMBER_WITH_COMMAS} from "@/constants/AppConstants";
import {EyeOutlined} from "@ant-design/icons";
import {HandleSale} from "@/components/Admin/Sale/SaleComponent";
import {IProductVariant} from "@/types/IProductVariant";

const {Text, Title} = Typography;

interface IProps {
    dataSource?: any[];
    nodeRef?: any;
    responsiveImage?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number };
    responsiveContent?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number };
    handleAddOrderItemCart:  (productVariantSelected: IProductVariant[]) => void;
}

const ProductListView: React.FC<IProps> = (props) => {
    const {dataSource, nodeRef, handleAddOrderItemCart,
        responsiveImage = {xs: 24, sm: 24, md: 12, lg: 12, xl:8, xxl: 3},
        responsiveContent = {xs: 24, sm: 24, md: 12, lg: 12, xl: 16, xxl: 21}} = props;
    const [isOpenModalListProductVariant, setOpenModalListProductVariant] = useState(false);
    const [productSelected, setProductSelected] = useState<IProduct | undefined>(undefined);

    return (
        <>
            <List
                ref={nodeRef}
                style={{width: "100%"}}
                dataSource={dataSource}
                renderItem={(item: IProduct, index) => (
                    <List.Item style={{borderBottom: 'none', padding: "5px 0px"}}>
                        <Card style={{flex: "1", cursor: "pointer"}} styles={{body: {padding: 8}}}>
                            <Row gutter={[16, 0]}>
                                {/* image */}
                                <Col xs={responsiveImage?.xs}
                                     sm={responsiveImage?.sm}
                                     md={responsiveImage?.md}
                                     lg={responsiveImage?.lg}
                                     xl={responsiveImage?.xl}
                                     xxl={responsiveImage?.xxl}
                                >
                                    <Flex justify="center" align="center">
                                        <Image
                                            src={item?.imageUrl}
                                            alt={item?.imageUrl}
                                            fallback={"/no-image.png"}
                                            style={{width: "100%", height: "auto"}}
                                            preview={{
                                                mask: <EyeOutlined/>
                                            }}
                                        />
                                    </Flex>
                                </Col>

                                {/* content */}
                                <Col xs={responsiveContent?.xs}
                                     sm={responsiveContent?.sm}
                                     md={responsiveContent?.md}
                                     lg={responsiveContent?.lg}
                                     xl={responsiveContent?.xl}
                                     xxl={responsiveContent?.xxl}
                                     onClick={() => {
                                         setProductSelected(item);
                                         setOpenModalListProductVariant(true);
                                     }}
                                >
                                    <List.Item.Meta
                                        title={
                                            <Flex align="center" justify="space-between" wrap>
                                                <Text strong>{`${item.productName}`}</Text>
                                                <Title level={5}
                                                       style={{textAlign: "right", display: "block", margin: 0}}>
                                                    {item.minSalePrice ? `${item.minSalePrice}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',') : 0}
                                                </Title>
                                            </Flex>
                                        }
                                        description={
                                            <>
                                                <span>Mã: {item.productCode}</span>
                                                <br/>
                                                <span>Tổng số: {item.totalProductInStock ?? 0}</span>
                                            </>
                                        }
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </List.Item>
                )}
            />

            <ModalListProductVariant
                product={productSelected}
                isOpenModalListProductVariant={isOpenModalListProductVariant}
                setOpenModalListProductVariant={setOpenModalListProductVariant}
                handleAddOrderItemCart={handleAddOrderItemCart}
            />
        </>

    );
}
export default memo(ProductListView);
