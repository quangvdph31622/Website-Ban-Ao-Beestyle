import React from 'react';
import { Select, Space } from 'antd';

interface IProps {
    selectedValues: any[];
    data?: any[];
    error?: [];
    isLoading?: boolean;
    onChange?: (selectedOptions: { value: number; label: string }[]) => void;
    onClear?: () => void;
}

const SizeOptionSelect: React.FC<IProps> = (props) => {
    const {selectedValues, data = [], error, isLoading, onChange, onClear} = props;

    const handleChange = (selectedValues: number[]) => {
        const selectedOptions = selectedValues.map(value => {
            const option = data.find(option => option.value === value);
            return { value, label: option?.label?.toString() || '' };
        });
        onChange && onChange(selectedOptions);
    }

    return (
        <Space style={{ width: '100%' }} direction="vertical">
            <Select
                showSearch
                mode="multiple"
                placement="bottomLeft"
                size="large"
                maxTagCount={7}
                value={selectedValues}
                style={{width: '100%'}}
                allowClear
                loading={isLoading}
                placeholder={isLoading ? "Đang tải..." : "---Lựa chọn---"}
                onChange={handleChange}
                onClear={onClear}
                options={data}
                filterOption={(input, option) =>
                    (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                }
            />
        </Space>
    );
}

export default SizeOptionSelect;