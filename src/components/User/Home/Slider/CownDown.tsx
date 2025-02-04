'use client';

import React from "react";
import Image from "next/image";
import { Typography, Statistic, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;
const { Countdown } = Statistic;

export default function CownDownArea() {

    const countdownDate = new Date('2025-01-10T00:00:00').getTime();

    return (
        <section className="cown-down">
            <div className="section-inner ">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 col-12 padding-right">
                            <div className="image">
                                <Image
                                    src="https://m.yodycdn.com/fit-in/filters:format(webp)/products/media/categories/2023-06-12-08-48-19_a5b00606-d7c0-4ba0-9611-33867680f45b.jpg"
                                    alt="#" width={750} height={590}
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 padding-left">
                            <div className="content">
                                <div className="heading-block">
                                    <Paragraph className="small-title" type="secondary">Giảm giá trong ngày</Paragraph>
                                    <Title level={3} className="title">Váy đẹp cho nữ</Title>
                                    <Paragraph className="text">
                                        Đặc biệt, các bộ sưu tập hot trend, thiết kế hiện đại và chất liệu cao cấp được
                                        giảm giá sâu, giúp bạn dễ dàng tìm thấy các món đồ vừa đẹp, vừa chất lượng mà
                                        không lo ngại về chi phí.
                                    </Paragraph>
                                    <Title level={1} className="price">
                                        990.000 đ <Text delete>1.099.000 đ</Text>
                                    </Title>
                                    <Divider />
                                    <div className="coming-time">
                                        <Countdown title="Kết thúc sau" value={countdownDate} format="D ngày H:mm:ss" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
