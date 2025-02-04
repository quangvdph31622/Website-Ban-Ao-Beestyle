import React, {memo, useState} from "react";
import {Badge} from "antd";

interface IProps {
    show?: boolean;
    propsBadge: React.ComponentProps<typeof Badge>;
}

const ExtraShowTotalElementFilter: React.FC<IProps> = (props) => {
    const {show, propsBadge} = props;

    return (
        show && (
            <Badge {...propsBadge}/>
        )
    );
};
export default memo(ExtraShowTotalElementFilter);