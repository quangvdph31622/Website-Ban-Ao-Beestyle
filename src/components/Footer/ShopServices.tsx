import React from 'react';
import { Row, Col } from 'antd';
import { IoPricetagsOutline, IoRocketOutline } from 'react-icons/io5';
import { CiLock } from 'react-icons/ci';

const ShopServices = () => {
    return (
        <section className="bg-gray-100 py-8">
            <div className="container mx-auto px-4 sm:px-8">
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <div className="flex items-center justify-center">
                            <IoRocketOutline className="text-4xl text-gray-700" />
                            <div className="ml-4">
                                <h4 className="text-lg font-bold text-gray-800">
                                    MIỄN PHÍ VẬN CHUYỂN
                                </h4>
                                <p className="text-gray-600">
                                    Dành cho đơn hàng từ 500.000 đ
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <div className="flex items-center justify-center">
                            <CiLock className="text-4xl text-gray-700" />
                            <div className="ml-4">
                                <h4 className="text-lg font-bold text-gray-800">
                                    THANH TOÁN AN TOÀN
                                </h4>
                                <p className="text-gray-600">Thanh toán an toàn 100%</p>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <div className="flex items-center justify-center">
                            <IoPricetagsOutline className="text-4xl text-gray-700" />
                            <div className="ml-4">
                                <h4 className="text-lg font-bold text-gray-800">
                                    GIÁ TỐT NHẤT
                                </h4>
                                <p className="text-gray-600">
                                    Mua hàng ngay với mức giá ưu đãi
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    );
};

export default ShopServices;
