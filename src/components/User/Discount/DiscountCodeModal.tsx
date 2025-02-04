import React, { useEffect, useState } from 'react';
import { Modal, Input } from 'antd';
import { TagOutlined, CloseOutlined } from '@ant-design/icons';
import VoucherList from './VoucherList';
import { IVoucherUser } from '@/types/IVoucher';
import { useVoucherData } from '@/services/VoucherService';

interface IDiscountModalType {
    isVisible: boolean;
    onClose: () => void | boolean;
    onApply: (voucher: IVoucherUser) => void;
}

const DiscountCodeModal: React.FC<IDiscountModalType> = ({ isVisible, onClose, onApply }) => {
    const { voucherItems, isLoading, error } = useVoucherData();
    const [discountCode, setDiscountCode] = useState('');
    const [searchResults, setSearchResults] = useState<IVoucherUser[]>(voucherItems || []);

    useEffect(() => {
        const results: IVoucherUser[] = voucherItems && voucherItems.length > 0 && voucherItems.filter((voucher: IVoucherUser) =>
            voucher.voucherCode.toLowerCase().startsWith(discountCode.toLowerCase())
        );
        setSearchResults(results);
    }, [discountCode, voucherItems]);

    return (
        <Modal
            title={
                <p className="text-center text-black text-lg font-semibold mb-3">Mã giảm giá</p>
            }
            open={isVisible}
            onCancel={onClose}
            closeIcon={<CloseOutlined />}
            footer={null}
            centered
            width={900}
        >
            {voucherItems && voucherItems.length > 0 ? (
                <>
                    <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg mb-3">
                        <Input
                            placeholder="Nhập mã giảm giá để tìm kiếm"
                            prefix={<TagOutlined className="text-gray-400 me-2" />}
                            className="rounded-lg h-10"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            allowClear
                        />
                    </div>
                    <VoucherList vouchers={searchResults} onApply={onApply} />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center mt-8 py-5">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <TagOutlined className="text-gray-300 text-4xl" />
                    </div>
                    <p className="text-gray-500 font-medium">
                        Bạn chưa có mã giảm giá nào
                    </p>
                </div>
            )}
        </Modal>
    );
};

export default DiscountCodeModal;
