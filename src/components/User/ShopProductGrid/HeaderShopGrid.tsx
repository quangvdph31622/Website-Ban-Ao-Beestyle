import {Flex, Select, Typography} from "antd";
import React, {memo} from "react";

const {Option} = Select;
const {Title} = Typography;

const HeaderShopGrid: React.FC = () => {
    return (
        <Flex justify="space-between" style={{marginBottom: 20}}>
            <div>
                <Title level={3} style={{margin: 0}}>Sản phẩm</Title>
            </div>
            <div>
                <Select defaultValue={null} placeholder="Sắp xếp theo"
                        style={{width: 175, marginLeft: 5}}
                >
                    <Option value="name">Tên sản phẩm</Option>
                    <Option value="price">Giá từ thấp đến cao</Option>
                    <Option value="size">Giá từ cao đến thấp</Option>
                </Select>
            </div>
        </Flex>
    );
}
export default memo(HeaderShopGrid);