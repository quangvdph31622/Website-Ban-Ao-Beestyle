"use client"
import React, {useState} from 'react';
import {Layout} from 'antd';
import AdminSideMenu from '../SideBar/AdminSideMenu';
import AdminHeader from '../Header/AdminHeader';

const {Content} = Layout;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [collapsed, setCollapsed] = useState(true);
    const toggleCollapsed = () => setCollapsed(!collapsed);

    return (
        <Layout>
            <AdminSideMenu collapsed={collapsed}/>
            <Layout>
                <AdminHeader collapsed={collapsed} onToggle={toggleCollapsed}/>
                <Content className="pt-5 pr-2.5 pb-2.5 pl-5 overflow-auto">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
