'use client';

import React, { useState } from 'react';
import { Carousel, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Image from "next/image";

export default function Slider() {
    const [isHovered, setIsHovered] = useState(false);

    const images = [
        { url: "/banner_slide_user/banner-01.jpg", alt: "Shop Banner 1" },
        { url: "/banner_slide_user/banner-02.jpg", alt: "Shop Banner 2" },
        { url: "/banner_slide_user/banner-03.jpg", alt: "Shop Banner 3" },
        { url: "/banner_slide_user/banner-04.jpg", alt: "Shop Banner 4" }
    ];

    const carouselRef = React.useRef<any>(null);

    const nextSlide = () => carouselRef.current?.next();
    const prevSlide = () => carouselRef.current?.prev();

    return (
        <div
            className="relative w-full max-w-8xl mx-auto overflow-hidden shadow-md"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Carousel
                autoplay
                autoplaySpeed={12000}
                ref={carouselRef}
                className="h-[400px] md:h-[520px]"
                dots={false}
            >
                {images.map((image, index) => (
                    <div key={index} className="h-full">
                        <Image
                            width={400}
                            height={575}
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                            unoptimized
                        />
                    </div>
                ))}
            </Carousel>

            {isHovered && (
                <>
                    <Button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white border-0 hover:!bg-black/80"
                        shape="circle"
                        icon={<LeftOutlined />}
                        size="large"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                    />
                    <Button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white border-0 hover:!bg-black/80"
                        shape="circle"
                        icon={<RightOutlined />}
                        size="large"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    />
                </>
            )}
        </div>
    );
}
