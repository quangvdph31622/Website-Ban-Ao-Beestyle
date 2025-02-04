import {Select} from "antd";
import React, {CSSProperties, memo} from "react";
import {SizeType} from "antd/es/config-provider/SizeContext";


interface IProps {
    size?: SizeType;
    placeholder?: string;
    value?: any;
    data?: any[];
    error?: [];
    isLoading?: boolean;
    onChange?: (value: any, option: any) => void;
    style?: CSSProperties
    onClear?: () => void;
}

const SelectSearchOptionLabel = (props: IProps) => {
    const {
        size,
        placeholder,
        style,
        value,
        data = [],
        error,
        isLoading,
        onChange,
        onClear
    } = props;

    return (
        <Select
            size={size}
            style={style}
            showSearch
            value={value}
            allowClear={true}
            placement="bottomLeft"
            loading={isLoading}
            placeholder={isLoading ? "Đang tải..." : placeholder}
            filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={data}
            onChange={onChange}
            onClear={onClear}
        />
    );
}
export default memo(SelectSearchOptionLabel);