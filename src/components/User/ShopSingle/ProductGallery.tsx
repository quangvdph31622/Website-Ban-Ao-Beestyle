/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Image } from 'antd';
import { ProductImage } from '@/services/user/SingleProductService';

const ProductGallery = ({ images }: ProductImage) => {

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
    };

    const sliderRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleThumbnailClick = (index: number) => {
        setSelectedIndex(index);
        sliderRef.current.slickGoTo(index);
    };

    const isSingleImage = images?.length === 1;

    return (
        <div className="product-gallery flex">
            <div
                className="thumbnails mb-4"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 15
                }}
            >
                {!isSingleImage && images?.map((image: { imageUrl: string | undefined; }, index: number) => (
                    <img
                        key={index}
                        src={image.imageUrl}
                        width={60}
                        height="auto"
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                            cursor: 'pointer',
                            border: selectedIndex === index ? '1px solid #333' : 'none',
                        }}
                        onClick={() => handleThumbnailClick(index)}
                    />
                ))}
            </div>
            <div style={{ flex: 1, width: '490px', marginLeft: 15 }}>
                {isSingleImage ? (
                    <Image
                        src={images[0].imageUrl}
                        alt="ProductCardItem Image"
                        width={500}
                        height={'auto'}
                        style={{ border: 0 }}
                        preview={false}
                    />
                ) : (
                    <Slider ref={sliderRef} {...settings}>
                        {images?.map((image: { imageUrl: string }, index: number) => (
                            <div key={index}>
                                <Image
                                    src={image.imageUrl}
                                    alt={`ProductCardItem Image ${index + 1}`}
                                    width={500}
                                    height={'auto'}
                                    style={{ border: 0 }}
                                    preview={false}
                                />
                            </div>
                        ))}
                    </Slider>
                )}
            </div>
        </div>
    );
};

export default ProductGallery;
