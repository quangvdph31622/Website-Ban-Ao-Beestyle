import React, {useMemo} from 'react';
import {Badge, Select, Tag} from 'antd';
import type {SelectProps} from 'antd';
import {CloseOutlined} from "@ant-design/icons";

type TagRender = SelectProps['tagRender'];

const getTagRender = (dataMap: Map<number, string | undefined>): TagRender => {
    return (props) => {
        const {label, value, closable, onClose} = props;
        const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
            event.preventDefault();
            event.stopPropagation();
        };

        const color = dataMap.get(value);

        return (
            <Tag
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                className="custom-tag-select"
            >
                <Tag className="custom-tag" color={color ?? "default"}/> {label}
            </Tag>
        );
    }
};

interface IProps {
    selectedValues: any[];
    data?: any[];
    error?: [];
    isLoading?: boolean;
    onChange?: (selectedOptions: { value: number; label: string }[]) => void;
    onClear?: () => void;
    size?: string;
}

const ColorOptionSelect = (props: IProps) => {
    const {selectedValues, data = [], error, isLoading, onChange, onClear} = props;
    const dataMap = new Map(data.map(item => [item.value, item.code]));
    const memoizedTagRender = useMemo(() => getTagRender(dataMap), [dataMap]);

    const handleChange = (selectedValues: number[]) => {
        const selectedOptions = selectedValues.map(value => {
            const option = data.find(option => option.value === value);
            return {value, label: option?.label?.toString() || ''};
        });
        onChange && onChange(selectedOptions);
    }

    return (
        <Select
            value={selectedValues}
            showSearch
            allowClear
            maxTagCount={7}
            style={{width: '100%'}}
            mode="multiple"
            placement="bottomLeft"
            size="large"
            loading={isLoading}
            placeholder={isLoading ? "Đang tải..." : "---Lựa chọn---"}
            tagRender={memoizedTagRender}
            options={data}
            optionRender={(option) => (
                <div className="flex align-middle">
                    <Tag className="custom-tag" color={option.data.code}/> {option.data.label}
                </div>
            )}
            filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={handleChange}
            onClear={onClear}
        />
    );
}
export default ColorOptionSelect;