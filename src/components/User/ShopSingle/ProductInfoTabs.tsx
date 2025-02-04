import { Typography } from 'antd';
import Title from 'antd/lib/typography/Title';

interface IProductInfo {
    productDescription:  | undefined;
}

const ProductInfoTabs: React.FC<IProductInfo> = ({ productDescription }) => {
    return (
        <div className="product-info">
            <div className="nav-main">
                <Typography>
                    <Title level={4}>Giới thiệu sản phẩm</Title>
                </Typography>
            </div>
            <div className="tab-content" id="myTabContent">
                <p>{productDescription}</p>
            </div>
        </div>
    );
};

export default ProductInfoTabs;
