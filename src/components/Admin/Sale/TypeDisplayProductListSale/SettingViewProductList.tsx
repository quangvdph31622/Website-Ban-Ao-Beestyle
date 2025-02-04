import React, {memo, useEffect} from "react";
import {AppstoreOutlined, BarsOutlined} from "@ant-design/icons";
import {Segmented} from "antd";

interface IProps {
    setViewMode: React.Dispatch<React.SetStateAction<string>>
    viewMode: string;
    scrollToTop?: () => void;
}

const SettingViewProductList: React.FC<IProps> = (props) => {
    const {viewMode, setViewMode, scrollToTop} = props;

    const handleViewChange = (value: string) => {
        setViewMode(value);
    };

    useEffect(() => {
        localStorage.setItem('viewModeSaleProductList', viewMode);
        if(scrollToTop) scrollToTop();
    }, [viewMode]);

    return (
        <Segmented
            options={[
                {value: 'list', icon: <BarsOutlined/>},
                {value: 'grid', icon: <AppstoreOutlined/>},
            ]}
            value={viewMode}
            onChange={handleViewChange}
        />
    )
}
export default memo(SettingViewProductList);