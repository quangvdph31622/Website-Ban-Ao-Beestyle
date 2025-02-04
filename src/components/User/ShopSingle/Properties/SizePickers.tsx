import React, { useEffect, useState } from 'react';
import { ProductSize, useProductSizes } from '@/services/user/SingleProductService';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import './css/property.css';
import SizeGuide from './SizeGuide';
import { LuPencilRuler } from 'react-icons/lu';

interface SizePickerProps {
    productId: number | undefined;
    colorCode: string | null;
    selectedSize: string | null;
    onSizeSelect: (size: string) => void;
}

const SizePicker: React.FC<SizePickerProps> = ({
    productId,
    colorCode,
    selectedSize,
    onSizeSelect,
}) => {
    const pathName = usePathname();
    const [visible, setVisible] = useState(false);
    const { data: sizes, isLoading: isLoadingSizes } = useProductSizes(productId, colorCode);
    const [selectInitialSize, setSelectInitialSize] = useState(false);

    useEffect(() => {
        if (colorCode && !selectedSize && sizes && sizes.length > 0 && !isLoadingSizes) {
            onSizeSelect(sizes[0].id);
            setSelectInitialSize(true);
        } else if (!colorCode || (sizes && sizes.length === 0)) {
            onSizeSelect(null);
            setSelectInitialSize(true);
        }
    }, [colorCode, sizes, selectedSize, onSizeSelect, isLoadingSizes]);

    const handleSizeClick = (size: string) => {
        onSizeSelect(size);
    };

    return (
        <>
            <div className='flex justify-between items-center'>
                <p className="text-black font-semibold">Kích thước:</p>
                <div
                    className={
                        pathName.includes('variant') && 'text-blue-500 cursor-pointer' || 'd-none'
                    }
                    onClick={() => setVisible(true)}
                >
                    <span className='flex items-center hover:!text-purple-500'>
                        <LuPencilRuler className='me-2' />
                        Bảng kích thước
                    </span>
                </div>
            </div>
            <ul
                style={{
                    display: 'flex',
                    listStyle: 'none',
                    padding: '0',
                    margin: '0',
                }}
            >
                {isLoadingSizes && <p>Đang tải kích thước...</p>}

                {!isLoadingSizes && (!sizes || sizes.length === 0) && <p>Không có kích thước</p>}

                {!isLoadingSizes && sizes && sizes.map((size: ProductSize) => (
                    <li key={size.id} style={{ marginRight: '10px' }}>
                        <Link
                            href="#"
                            className={
                                selectedSize === size.id
                                    ? 'bg-black text-white size-variant'
                                    : 'size-variant'
                            }
                            onClick={(e) => {
                                e.preventDefault();
                                handleSizeClick(size.id);
                            }}
                        >
                            {size.sizeName}
                        </Link>
                    </li>
                ))}
            </ul>
            {visible && (
                <SizeGuide visible={visible} onClose={() => setVisible(false)} />
            )}
        </>
    );
};

export default SizePicker;
