import React from "react";
import { Flex, Result } from "antd";

const Unauthorized = () => {
    return (
        <Flex justify="center" align="center" className="h-screen">
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
            />
        </Flex>
    );
}

export default Unauthorized;
