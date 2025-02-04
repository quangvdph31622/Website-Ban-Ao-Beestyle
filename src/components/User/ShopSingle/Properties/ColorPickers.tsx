import React, { useEffect, useState } from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { useProductColors } from '@/services/user/SingleProductService';
import './css/property.css';
import { Button } from 'antd';

const getBrightness = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
};

const ColorPickers = (props: any) => {
    const { data: colors, isLoading: isLoadingColors } = useProductColors(props.productId);
    const [selectedColorName, setSelectedColorName] = useState<string | null>(null);

    useEffect(() => {
        if (colors && colors.length > 0 && !isLoadingColors) {
            const defaultColor = colors[0].colorCode;
            const colorDefault: any = colors.find((color) => color.colorCode === defaultColor);

            if (!props.selectedColor) {
                props.onColorSelect(defaultColor);
                setSelectedColorName(colorDefault?.colorName || null);
            }
        }
    }, [props.productId, colors, props, isLoadingColors]);

    const handleColorClick = (color: string, colorName: string) => {
        setSelectedColorName(colorName);
        props.onColorSelect(color);
    };

    return (
        <div className="mb-4">
            <div className="flex items-center">
                <span className="font-semibold">Màu sắc :</span>
                {props.selectedColor ? (
                    <span className="ml-2 font-normal" style={{ color: '#da880d' }}>
                        {selectedColorName}
                    </span>
                ) : (
                    <span className="ml-2 font-normal" style={{ color: 'red' }}>
                        Chọn màu sắc
                    </span>
                )}
            </div>
            <div className="flex flex-wrap mt-2">
                {isLoadingColors && <p>Đang tải màu sắc...</p>}

                {!isLoadingColors && colors?.map((color: any, index: any) => {
                    const isSelected = props.selectedColor === color.colorCode;
                    const brightness = getBrightness(color.colorCode);
                    const checkColor = brightness > 128 ? 'black' : 'white';

                    return (
                        <Button
                            key={index.toString()}
                            className={`mr-2 mb-2 rounded-full w-11 h-11 flex items-center justify-center ${isSelected ? 'border-1' : ''}`}
                            style={{
                                backgroundColor: `${color.colorCode}`,
                                border: isSelected ? '1px solid gray' : 'none',
                            }}
                            onClick={() => handleColorClick(color.colorCode, color.colorName)}
                        >
                            {isSelected && <CheckOutlined style={{ color: checkColor, fontSize: 20 }} />}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default ColorPickers;
