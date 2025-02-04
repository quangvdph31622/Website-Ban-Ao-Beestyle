import { Card, Col, Row } from "antd";
import Meta from "antd/es/card/Meta";
import Link from "next/link";
import Image from 'next/image';
import React from "react";

interface IProps {
    newsData: Array<{
        id: number;
        title: string;
        imageUrl: string;
        date: string;
    }>;
}

const MoreFashionNews: React.FC<IProps> = (props) => {
    const {newsData} = props;

    return (
        <>
            <h1 className="text-2xl font-bold mt-5 mb-4 text-center">THỜI TRANG THẾ GIỚI</h1>
            <div className="flex justify-between items-center my-4">
                <h2 className="text-lg font-medium">Mới nhất</h2>
            </div>
            <Row gutter={[16, 16]}>
                {props.newsData.slice(4, 8).map((news) => (
                    <Col key={news.id} xs={24} sm={12} md={6}>
                        <Link
                            href={`/news/${news.id}/blog`}
                            className='link-no-decoration'
                            passHref
                        >
                            <Card
                                hoverable
                                cover={
                                    <Image
                                        src={news.imageUrl}
                                        alt={news.title}
                                        width={320} height={280}
                                        unoptimized
                                    />
                                }
                                className="h-full flex flex-col transition-opacity duration-700 ease-in-out"
                            >
                                <Meta title={news.title} className="flex-grow mb-2" />
                                <div className="mt-auto">
                                    <p className="text-gray-500">THỜI TRANG THẾ GIỚI | {news.date}</p>
                                </div>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default MoreFashionNews;
