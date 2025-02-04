import {Button, ButtonProps, ConfigProvider} from "antd";
import React, {memo} from "react";
import {TinyColor} from "@ctrl/tinycolor";

interface IProps {
    bgColor?: string;
}

const ColorButton: React.FC<IProps & ButtonProps> = ({bgColor, children, ...props}) => {

    const defaultColor: string = '#1890ff';
    const color: string = bgColor || defaultColor;

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: color,
                    colorPrimaryHover: new TinyColor(bgColor).lighten(5).toString(),
                    colorPrimaryActive: new TinyColor(bgColor).darken( 5).toString(),
                },
            }}
        >
            <Button {...props}>{children}</Button>
        </ConfigProvider>
    );
}

export default memo(ColorButton);