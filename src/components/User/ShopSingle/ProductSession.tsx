'use client';

import ProductGallery from './ProductGallery';
import ProductDescription from './ProductDescription';
import ProductInfoTabs from './ProductInfoTabs';
import { useParams } from "next/navigation";
import { useProduct } from "@/services/user/SingleProductService";
import BreadcrumbSection from '@/components/Breadcrumb/BreadCrumb';
import { useState, useEffect } from 'react';

const ProductSection = () => {
    const params = useParams();
    const productId: string = params?.id as string;
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

    const { data: product } = useProduct(productId, selectedColor, selectedSize);

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
    };

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
    };

    useEffect(() => {
        setSelectedSize(undefined);
    }, [selectedColor]);

    const breadcrumbItems = [
        { title: 'Trang chủ', path: '/' },
        { title: product?.categoryName, path: '/product' },
        { title: product?.productName },
    ];

    return (
        <>
            <BreadcrumbSection items={breadcrumbItems} />
            <section className="shop single section" style={{ backgroundColor: '#ffffff' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-lg-6 col-12">
                                    <ProductGallery images={product?.images} />
                                </div>
                                <div className="col-lg-6 col-12">
                                    <ProductDescription
                                        product={product}
                                        productId={productId}
                                        selectedColor={selectedColor}
                                        selectedSize={selectedSize}
                                        onColorSelect={handleColorSelect}
                                        onSizeSelect={handleSizeSelect}
                                    />
                                </div>
                            </div>
                            <ProductInfoTabs productDescription={product?.description} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductSection;
