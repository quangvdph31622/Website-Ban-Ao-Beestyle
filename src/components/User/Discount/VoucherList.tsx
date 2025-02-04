import React from 'react';
import { Card, message } from 'antd';
import { IVoucherUser } from '@/types/IVoucher';
import { TagOutlined } from '@ant-design/icons';
import { getAccountInfo } from '@/utils/AppUtil';

interface VoucherListProps {
    vouchers: IVoucherUser[];
    onApply: (voucher: IVoucherUser) => void;
}

const VoucherList: React.FC<VoucherListProps> = ({ vouchers, onApply }) => {
    // Áp dụng voucher
    const handleApplyVoucher = (voucher: IVoucherUser) => {
        if (getAccountInfo() && voucher) {
            onApply(voucher);
            message.success("Đã áp dụng voucher " + voucher.voucherCode);
        } else {
            message.error(`Voucher ${voucher.voucherCode} không tồn tại`);
        }
    };

    return (
        <div className="max-h-[500px] overflow-y-auto pr-2">
            {vouchers && vouchers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vouchers.map((voucher) => {
                        return (
                            <Card
                                key={voucher.id}
                                className={
                                    voucher.status === "ACTIVE" ?
                                        "relative rounded-md overflow-hidden flex flex-col h-full shadow-md" :
                                        "d-none"
                                }
                                style={{ border: '1px solid #f0f0f0' }}
                                styles={{ body: { padding: 15 } }}
                            >
                                <div className="absolute top-0 left-0 w-2 bg-yellow-400 h-full"></div>

                                <div className="flex-1 ms-2">
                                    <div className="font-bold text-base text-black mb-1 truncate">{voucher.voucherCode}</div>
                                    <div className="text-sm font-semibold text-black mb-1">
                                        {voucher.voucherName}
                                    </div>

                                    <div className="text-xs text-gray-600 truncate">
                                        {voucher.discountType === 'PERCENTAGE' ?
                                            `Giảm giá ${voucher.discountValue}% (tối đa ${voucher.maxDiscount.toLocaleString()}đ)` :
                                            voucher.discountType === 'CASH' ? `Giảm giá ${voucher.discountValue.toLocaleString()}đ` : ''
                                        }
                                    </div>

                                    <div className="text-xs text-gray-600 truncate mt-1">
                                        Cho đơn từ: {voucher.minOrderValue.toLocaleString()}đ
                                    </div>

                                    <div className="mt-1 text-xs text-gray-500">
                                        <span className={voucher.status === 'EXPIRED' && 'text-red-500' || ''}>
                                            HSD: {
                                                new Date(voucher.endDate).toLocaleDateString('en-GB',
                                                    { day: '2-digit', month: '2-digit', year: 'numeric' }
                                                )
                                            }
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="mt-2 ms-2 bg-black text-white px-2 py-1 rounded-md text-xs hover:!bg-gray-800 focus:outline-none disabled:opacity-50"
                                    onClick={() => handleApplyVoucher(voucher)}
                                    disabled={voucher.status === 'EXPIRED'}
                                >
                                    {voucher.status === 'EXPIRED' ? 'Đã hết hạn' : 'Áp dụng'}
                                </button>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center mt-8 py-5">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <TagOutlined className="text-gray-300 text-4xl" />
                    </div>
                    <p className="text-gray-500 font-medium">
                        Không tìm thấy mã giảm giá nào
                    </p>
                </div>
            )}
        </div>
    );
};

export default VoucherList;
