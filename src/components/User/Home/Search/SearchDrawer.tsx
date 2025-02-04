import React from 'react';
import { Drawer, Input } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { Image } from 'antd/lib';

interface SearchDrawerProps {
    open: boolean;
    onClose: () => void;
}

const SearchDrawer = ({ open, onClose }: SearchDrawerProps) => {
    return (
        <Drawer
            placement="top"
            closable={false}
            onClose={onClose}
            open={open}
            height="auto"
            style={{ padding: 0 }}
        >
            <div className="flex items-center justify-between px-4 py-4">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={200}
                    height={'auto'}
                    preview={false}
                />

                <div className="relative w-[50%] max-w-[600px]">
                    <Input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full py-3 px-4 border border-gray-300 bg-gray-100 rounded-md focus:!border-orange-400"
                        size='large'
                    />
                    <SearchOutlined
                        className="absolute top-1/2 right-3 transform -translate-y-1/2
                                   text-gray-500 cursor-pointer text-lg"
                    />  
                </div>

                <CloseOutlined
                    className="text-lg text-gray-800 cursor-pointer hover:bg-slate-100 p-2 rounded-lg"
                    onClick={onClose}
                />
            </div>
        </Drawer>
    );
};

export default SearchDrawer;
