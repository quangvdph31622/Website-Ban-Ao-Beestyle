'use client';

import { Typography, Card, Row, Col } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

const { Title, Text } = Typography;

const blogs = [
    {
        id: 1,
        date: '14 Tháng 11, 2024. Thứ Sáu',
        title: 'Điểm danh 15 trang phục truyền thống nổi tiếng của các nước',
        link: '/news/7/blog',
        image: 'https://m.yodycdn.com/fit-in/filters:format(webp)/blog/kham-pha-trang-phuc-truyen-thong-cua-cac-nuoc.jpg',
    },
    {
        id: 2,
        date: '15 Tháng 11, 2024. Thứ Bảy',
        title: 'Ý nghĩa của áo dài Việt Nam: Tìm hiểu nguồn gốc và lịch sử',
        link: '/news/6/blog',
        image: 'https://m.yodycdn.com/fit-in/filters:format(webp)/blog/y-nghia-cua-ao-dai-yodyvn.jpg',
    },
    {
        id: 3,
        date: '16 Tháng 11, 2024. Chủ Nhật',
        title: 'Khám phá trang phục các dân tộc Việt Nam đẹp đến ngỡ ngàng',
        link: '/news/8/blog',
        image: 'https://m.yodycdn.com/fit-in/filters:format(webp)/blog/kham-pha-trang-phuc-cac-dan-toc-viet-nam.jpg',
    },
];

export default function ShopBlogSection() {
    return (
        <section className="shop-blog section">
            <div className="container">
                <div className="section-title">
                    <Title level={2}>Tin thời trang</Title>
                </div>

                <Row gutter={[16, 16]}>
                    {blogs.map((blog) => (
                        <Col key={blog.id} lg={8} md={12} sm={24}>
                            <Card
                                hoverable
                                cover={<Image width={370} height={300} src={blog.image} alt={blog.title} unoptimized />}
                                className="shop-single-blog text-center"
                            >
                                <div className="content">
                                    <Text className="date" type="secondary">
                                        {blog.date}
                                    </Text>
                                    <Title level={5} className="title mb-4">
                                        {blog.title}
                                    </Title>
                                    <Link
                                        href={blog.link}
                                        className="more-btn btn btn-dark !border-none text-white w-full hover:!bg-orange-400"
                                    >
                                        Chi tiết
                                    </Link>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
}
