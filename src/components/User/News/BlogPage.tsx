'use client';

import UserLoader from '@/components/Loader/UserLoader';
import { Typography } from 'antd';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import BreadcrumbSection from '@/components/Breadcrumb/BreadCrumb';

const { Title, Paragraph } = Typography;

const fetcher = (...args: [string]) => fetch(...args).then((res) => res.json());

interface IBlogPost {
    title: string;
    intro: string;
    imageUrl: string;
    content: string;
}

const BlogPage = () => {
    const blogApi = 'https://gist.githubusercontent.com/anhvdph33906/2f613c2ed94d1c2399785032d0b4c4fd/raw/0fc9ca91a51f6851f3ff8cc1f45dbe884648a2eb/db.json';
    const { data: blogData, error } = useSWR(blogApi, fetcher);
    const [blogPosts, setBlogPosts] = useState<IBlogPost[]>([]);
    const params = useParams();

    useEffect(() => {
        if (blogData && blogData.data) {
            setBlogPosts(blogData.data);
        }
    }, [blogData]);

    if (error) return <div className='text-center p-5'>Không có dữ liệu</div>;
    if (!blogPosts || blogPosts.length === 0) return <UserLoader />;

    const currentBlog: any = blogPosts[Number(params.id) - 1];

    const breadcrumbItems = [
        { title: 'Trang chủ', path: '/' },
        { title: 'Tin thời trang', path: '/news' },
        { title: currentBlog[0].title },
    ];

    return (
        <>
            <BreadcrumbSection items={breadcrumbItems} />
            <div className="container mx-auto p-4 md:p-8">
                {currentBlog && (
                    <div>
                        <Title level={1} className="text-2xl md:text-3xl font-bold uppercase text-center">
                            {currentBlog[0]?.title}
                        </Title>
                        {currentBlog.slice(0, 2).map((data: IBlogPost, index: number) => (
                            <div key={index}>
                                <Typography className="text-center mb-8">
                                    <Paragraph className="fw-semibold md:text-base text-gray-700">
                                        {data.intro}
                                    </Paragraph>
                                </Typography>

                                <section className="mb-8 flex justify-center">
                                    <Image
                                        src={data.imageUrl}
                                        alt="Be Women, Be Proud"
                                        width={600} height={800}
                                        unoptimized
                                    />
                                </section>

                                <section>
                                    <Paragraph className="text-sm md:text-base text-gray-700 text-center">
                                        {data.content}
                                    </Paragraph>
                                </section>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default memo(BlogPage);
