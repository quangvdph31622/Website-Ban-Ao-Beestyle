import React from 'react';
import { Avatar, Button, MenuProps } from 'antd';
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Header } from "antd/es/layout/layout";
import { getAdminAccountInfo } from '@/utils/AppUtil';

const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    width: '100%',
    display: 'flex',
    border: '1px solid #E6EBF1',
    borderLeft: 'none',
    background: 'white',
    padding: 0
}

interface IProps {
    collapsed: boolean;
    onToggle: () => void;
}

const AdminHeader: React.FC<IProps> = ({ collapsed, onToggle }) => {

    const handleLogout = () => {
        localStorage.removeItem('authenticationAdmin');
        localStorage.setItem('loggedOut', Date.now().toString());
        window.location.href = '/admin-account';
    };

    return (
        <Header style={headerStyle} >
            <Button
                type="text" onClick={onToggle}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                style={{ fontSize: '16px', width: 64, height: 64, }}
            />
            <div className="absolute right-5 cursor-pointer">
                <Avatar
                    size="default"
                    src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                    style={{ backgroundColor: '#f5f5f5', }}
                />
                <span className='ms-2'>{getAdminAccountInfo() ? getAdminAccountInfo()?.fullName : ''}</span>
                <button className='ms-5' onClick={handleLogout}>
                    <LogoutOutlined className='me-1' />
                    Đăng xuất
                </button>
            </div>
        </Header>
    );
};

export default AdminHeader;
