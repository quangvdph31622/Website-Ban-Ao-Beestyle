import {Col, Collapse, Radio, Row, Typography} from "antd";
import React, {memo} from "react";
import {GENDER_KEY} from "@/constants/Gender";

const {Title} = Typography;

interface IProps {
    onChange?: any;
    disabled?: boolean;
}

const GenderFilter = (props: IProps) => {
    const {onChange, disabled = false} = props;

    return (
        <Collapse
            size="small"
            className="w-full bg-white"
            ghost
            expandIconPosition="end"
            style={{
                borderRadius: 8,
                boxShadow: "0 1px 8px rgba(0, 0, 0, 0.15)",
                maxWidth: 256,
            }}
            items={[
                {
                    key: "gender",
                    label: (
                        <Title level={5} style={{margin: "0px 10px"}}>
                            Giới tính
                        </Title>
                    ),
                    children: (
                        <div style={{maxHeight: 400, overflow: "auto"}}>
                            <Radio.Group onChange={onChange} disabled={disabled}>
                                <Row>
                                    <Col key={"ALL"} span={24} style={{marginBottom: 10}}>
                                        <Radio value={undefined} style={{marginLeft: 10}}>
                                            Tất cả
                                        </Radio>
                                    </Col>
                                    {Object.keys(GENDER_KEY).map((key) => (
                                        <Col key={key} span={24} style={{marginBottom: 10}}>
                                            <Radio value={key} style={{marginLeft: 10}}>
                                                {GENDER_KEY[key as keyof typeof GENDER_KEY]}
                                            </Radio>
                                        </Col>
                                    ))}
                                </Row>
                            </Radio.Group>
                        </div>
                    ),
                },
            ]}
        />
    );
};
export default memo(GenderFilter);
