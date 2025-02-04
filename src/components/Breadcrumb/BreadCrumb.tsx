'use client';

import React from 'react';
import { Breadcrumb } from 'antd';
import Link from 'next/link';

interface BreadcrumbItem {
    title: string;
    path?: string;
}

interface BreadcrumbSectionProps {
    items: BreadcrumbItem[];
}

const BreadcrumbSection: React.FC<BreadcrumbSectionProps> = ({ items }) => {
    const breadcrumbItems = items.map((item) => ({
        title: item.path ? (
            <Link href={item.path} className="text-black hover:!bg-slate-100 no-underline" passHref>
                <span style={{ color: '#333', fontWeight: 'normal' }}>{item.title}</span>
            </Link>
        ) : (
            <span style={{ color: '#333' }}>{item.title}</span>
        ),
    }));

    return (
        <div className="breadcrumb-section py-2" style={{ background: '#F5F5F5', padding: '10px 0' }}>
            <div className="max-w-[1470px] mx-auto">
                <Breadcrumb
                    separator="/"
                    style={{ fontSize: '14px', fontWeight: '500' }}
                    items={breadcrumbItems}
                />
            </div>
        </div>
    );
};

export default BreadcrumbSection;
