import {Col, Collapse, Radio, Row, Typography} from "antd";
import {STATUS} from "@/constants/Status";
import React, {memo} from "react";

const {Title} = Typography;

interface IProps {
    onChange?: any,
    disabled?: boolean
}

const StatusFilter = (props: IProps) => {
    const {onChange, disabled = false} = props;

    return (
        <Collapse
            size="small" className="w-full bg-white" ghost expandIconPosition="end" collapsible="icon"
            style={{borderRadius: 8, boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)', maxWidth: 256}}
            items={[
                {
                    key: 'status',
                    label: <Title level={5} style={{margin: '0px 10px'}}>Trạng thái</Title>,
                    children: (
                        <div style={{maxHeight: 400, overflow: "auto"}}>
                            <Radio.Group onChange={onChange} disabled={disabled}>
                                <Row>
                                    <Col key={"ALL"} span={24} style={{marginBottom: 10}}>
                                        <Radio value={undefined} style={{marginLeft: 10}}>Tất cả</Radio>
                                    </Col>
                                    {Object.keys(STATUS).map((key) => (
                                        <Col key={key} span={24} style={{marginBottom: 10}}>
                                            <Radio value={key} style={{marginLeft: 10}}>
                                                {STATUS[key as keyof typeof STATUS]}
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
}
export default memo(StatusFilter);