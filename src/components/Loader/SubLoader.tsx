import {Flex, Spin, SpinProps} from "antd";
import React from "react";

interface IProps extends SpinProps {}

const SubLoader: React.FC<IProps> = (props) => {
    return (
        <Flex align="center" justify="center" style={{ height: '100%', width: "100%"}}>
            <Spin {...props}/>
        </Flex>
    );
};

export default SubLoader;