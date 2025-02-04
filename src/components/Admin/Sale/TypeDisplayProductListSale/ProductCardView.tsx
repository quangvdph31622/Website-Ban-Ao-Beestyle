import {Card, Image, List, Space, theme, Tooltip, Typography} from "antd";
import React, {memo, useContext, useState} from "react";
import Marquee from "react-fast-marquee";
import {IProduct} from "@/types/IProduct";
import ModalListProductVariant from "@/components/Admin/Sale/ModalListProductVariant";
import {FORMAT_NUMBER_WITH_COMMAS} from "@/constants/AppConstants";
import {EyeOutlined} from "@ant-design/icons";
import {ListGridType} from "antd/es/list";
import {IProductVariant} from "@/types/IProductVariant";

const {Text, Title} = Typography;

interface IProps {
    dataSource?: any[];
    nodeRef: any;
    grid?: ListGridType | undefined;
    handleAddOrderItemCart:  (productVariantSelected: IProductVariant[]) => void;
}

const ProductCardView: React.FC<IProps> = (props) => {
    const {dataSource, nodeRef, handleAddOrderItemCart,
        grid = {gutter: 8, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4}} = props;
    const [isOpenModalListProductVariant, setOpenModalListProductVariant] = useState(false);
    const [productSelected, setProductSelected] = useState<IProduct | undefined>(undefined);

    return (
        <>
            <List
                ref={nodeRef}
                grid={grid}
                dataSource={dataSource}
                renderItem={(item: IProduct) => (
                    <List.Item>
                        <Card
                            hoverable
                            style={{
                                flex: "1", cursor: "pointer",
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0

                            }}
                            styles={{body: {padding: 10}}}
                            cover={
                                <Image
                                    src={item?.imageUrl}
                                    alt={item?.imageUrl}
                                    fallback={"/no-image.png"}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                    }}
                                    preview={{
                                        mask: <EyeOutlined/>

                                    }}
                                />
                            }
                        >
                            <Space direction="vertical"
                                   onClick={() => {
                                       setProductSelected(item);
                                       setOpenModalListProductVariant(true);
                                   }}
                            >
                                <Tooltip title={item.productName}>
                                    <div>
                                        <Marquee speed={30} pauseOnHover={true}>
                                            <Text strong style={{marginRight: 30}}>
                                                {item.productName}
                                            </Text>
                                        </Marquee>
                                    </div>
                                </Tooltip>
                                <Text type="secondary">
                                    <span>{`Mã: ${item.productCode}`}</span>
                                    <br/>
                                    <span>{`Tổng số: ${item.totalProductInStock ?? 0}`}</span>
                                </Text>
                                <Title level={5} style={{textAlign: "right", display: "block", margin: 0}}>
                                    {item.minSalePrice ? `${item.minSalePrice}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',') : 0}
                                </Title>
                            </Space>
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
export default memo(ProductCardView);

