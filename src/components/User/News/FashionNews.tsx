'use client';

import React, { memo, useState } from 'react';
import { Card, Row, Col, Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import MoreFashionNews from './MoreFashionNews';
import BreadcrumbSection from '@/components/Breadcrumb/BreadCrumb';

const { Meta } = Card;
const initialNewsData = [
    {
        id: 1,
        title: 'Chuỗi hình ảnh đẹp tại "TỦ ĐỒ YÊU THƯƠNG"',
        imageUrl: 'https://m.yodycdn.com/fit-in/filters:format(webp)/products/media/articles/tu-do-yeu-thuong.jpg',
        date: '10/12/2024',
    },
    {
        id: 2,
        title: 'Cùng BeeStyle lan tỏa yêu thương với chương trình "Áo ấm đêm Giáng sinh"',
        imageUrl: 'https://m.yodycdn.com/fit-in/filters:format(webp)/products/media/articles/ao-am-dem-giang-sinh.jpg',
        date: '10/12/2024',
    },
    {
        id: 3,
        title: 'BeeStyle thông báo phát động chương trình "Dệt yêu thương cho em"',
        imageUrl: 'https://m.yodycdn.com/fit-in/filters:format(webp)/products/media/articles/det-yeu-thuong-cho-em.jpg',
        date: '10/12/2024',
    },
    {
        id: 4,
        title: '"Tủ đồ yêu thương" - Trạm quyên góp quần áo miễn phí cho bà con',
        imageUrl: 'https://m.yodycdn.com/fit-in/filters:format(webp)/products/media/articles/tu-do-yeu-thuong.jpg',
        date: '10/12/2024',
    },
    {
        id: 5,
        title: 'Unisex là gì? 4 hiểu lầm trầm trọng về thời trang unisex',
        imageUrl: 'https://m.yodycdn.com/fit-in/filters:format(webp)/blog/cach-phoi-do-unisex-yody-vn-30.jpg',
        date: '11/12/2024',
    },
    {
        id: 6,
        title: 'Điểm danh 15 trang phục truyền thống nổi tiếng của các nước',
        imageUrl: 'https://m.yodycdn.com/fit-in/filters:format(webp)/blog/kham-pha-trang-phuc-truyen-thong-cua-cac-nuoc.jpg',
        date: '11/12/2024',
    },
    {
        id: 7,
        title: 'Ý nghĩa của áo dài Việt Nam: Tìm hiểu nguồn gốc và lịch sử',
        imageUrl: 'https://m.yodycdn.com/fit-in/filters:format(webp)/blog/y-nghia-cua-ao-dai-yodyvn.jpg',
        date: '11/12/2024',
    },
    {
        id: 8,
        title: 'Khám phá trang phục các dân tộc Việt Nam đẹp đến ngỡ ngàng',
        imageUrl: 'https://m.yodycdn.com/fit-in/filters:format(webp)/blog/kham-pha-trang-phuc-cac-dan-toc-viet-nam.jpg',
        date: '11/12/2024',
    },
];

const FashionNews = () => {
    const [newsData, setNewsData] = useState(initialNewsData);
    const [showMore, setShowMore] = useState(true);
    const [showSecondSection, setShowSecondSection] = useState(false);

    const handleShowMore = () => {
        setShowMore(false);
        setShowSecondSection(true);
    };

    const handleCollapse = () => {
        setShowMore(true);
        setShowSecondSection(false);
    };

    const breadcrumbItems = [
        { title: 'Trang chủ', path: '/' },
        { title: 'Tin thời trang' },
    ];

    return (
        <>
            <BreadcrumbSection items={breadcrumbItems} />
            <div className="container mx-auto p-4">
                <div className='py-5'>
                    <Image
                        src={"/img_news/news-banner.webp"}
                        alt='IMG' unoptimized
                        width={1280} height={555}
                    />
                </div>
                <h1 className="text-2xl font-bold mb-4 text-center">CHUYỂN ĐỘNG TRAO YÊU THƯƠNG</h1>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Mới nhất</h2>
                    {newsData.length > 4 && (
                        <Button type="link" className="text-blue-500" onClick={showMore ? handleShowMore : handleCollapse}>
                            {showMore ? "Xem thêm →" : "Thu gọn ←"}
                        </Button>
                    )}
                </div>
                <Row gutter={[16, 16]}>
                    {newsData.slice(0, 4).map((news) => (
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
                                        <p className="text-gray-500">CHUYỂN ĐỘNG TRAO YÊU THƯƠNG | {news.date}</p>
                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
                {showSecondSection && (<MoreFashionNews newsData={newsData} />)}
            </div>
        </>
    );
};

export default memo(FashionNews);
