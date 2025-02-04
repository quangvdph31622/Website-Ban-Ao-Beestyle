import React, {memo, useState} from 'react';
import {cyan, generate, green, presetPalettes, red} from '@ant-design/colors';
import {Col, ColorPicker, Divider, GetProp, Row, Space, theme} from 'antd';
import type {ColorPickerProps} from 'antd';

type Presets = Required<ColorPickerProps>['presets'][number];
type Color = Extract<GetProp<ColorPickerProps, 'value'>, string | { cleared: any }>;
type Format = GetProp<ColorPickerProps, 'format'>;

const genPresets = (presets = presetPalettes) =>
    Object.entries(presets).map<Presets>(([label, colors]) => ({
        label,
        colors,
    }));

interface IProps {

    onChange?: (value: any) => void;
}

const ColorPickerCustomize = (props: IProps) => {
    const {onChange} = props;
    const [colorHex, setColorHex] = useState<Color>('');
    const [formatHex, setFormatHex] = useState<Format | undefined>('hex');
    const {token} = theme.useToken();

    const hexString = React.useMemo<string>(
        () => (typeof colorHex === 'string' ? colorHex : colorHex?.toHexString()),
        [colorHex],
    );

    const handleColorChange = (value: Color) => {
        let hexValue = typeof value === 'string' ? value : value?.toHexString();
        if (hexValue?.endsWith('00')) {
            hexValue = "default";
        }
        setColorHex(hexValue);
        if (onChange) onChange(hexValue);
    };

    const presets = genPresets({
        primary: generate(token.colorPrimary),
        red,
        green,
        cyan,
    });

    const customPanelRender: ColorPickerProps['panelRender'] = (
        _,
        {components: {Picker, Presets}},
    ) => (
        <Row justify="space-between" wrap={false}>
            <Col span={12}>
                <Presets/>
            </Col>
            <Divider type="vertical" style={{height: 'auto'}}/>
            <Col flex="auto">
                <Picker/>
            </Col>
        </Row>
    );

    return (
        <Space>
            <ColorPicker
                allowClear
                format={formatHex}
                value={colorHex}
                onChange={handleColorChange}
                onFormatChange={setFormatHex}
                styles={{popupOverlayInner: {width: 480}}}
                presets={presets}
                panelRender={customPanelRender}
            />
            <span>{hexString}</span>
        </Space>
    );
};
export default memo(ColorPickerCustomize);