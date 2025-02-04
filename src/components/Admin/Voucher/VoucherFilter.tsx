import {Checkbox, Col, Collapse, Radio, RadioChangeEvent, Row, Space, Typography} from "antd";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {memo, useEffect, useState} from "react";
import {DISCOUNT_TYPE} from "../../../constants/DiscountType";
import {DISCOUNT_STATUS} from "../../../constants/DiscountStastus";

const {Title} = Typography;
interface IProps {
    error?: Error;
}

const VoucherFilter = (props: IProps) => {
    const [isErrorNetWork, setErrorNetWork] = useState(false);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();
    const {error} = props;

    useEffect(() => {
        if (error) setErrorNetWork(true);
        else setErrorNetWork(false);
    }, [error]);

    const onChange = (e: RadioChangeEvent) => {
        const params = new URLSearchParams(searchParams);
        const value = e.target.value;
        if (value) {
            params.set("status", value);
            params.set("page", "1");
        } else {
            params.delete("status");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const onChangeDiscountType = (e: RadioChangeEvent) => {
        const params = new URLSearchParams(searchParams);
        const value = e.target.value;
        console.log("Selected discount type:", value); // Debug log
        if (value) {
            params.set("discountType", value);
            params.set("page", "1");
        } else {
            params.delete("discountType");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Space direction="vertical" style={{minWidth: 256}}>
            <Collapse size="small" className="w-full bg-white" ghost expandIconPosition="end"
                      style={{borderRadius: 8, boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)', maxWidth: 256}}
                      items={[
                          {
                              key: 'status',
                              label: <Title level={5} style={{margin: '0px 10px'}}>Trạng thái</Title>,
                              children: (
                                  <Radio.Group onChange={onChange} disabled={isErrorNetWork}>
                                      <Row>
                                          <Col key={"ALL"} span={24} style={{marginBottom: 10}}>
                                              <Radio value={undefined} style={{marginLeft: 10}}>Tất cả</Radio>
                                          </Col>
                                          { Object.keys(DISCOUNT_STATUS).map((key) => (
                                              <Col key={key} span={24} style={{marginBottom: 10}}>
                                                  <Radio value={key} style={{marginLeft: 10}}>
                                                      {DISCOUNT_STATUS[key as keyof typeof DISCOUNT_STATUS]}
                                                  </Radio>
                                              </Col>
                                          ))}
                                      </Row>
                                  </Radio.Group>
                              ),
                          },
                      ]}
            />
            <Collapse size="small" className="w-full bg-white" ghost expandIconPosition="end"
                      style={{borderRadius: 8, boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)', maxWidth: 256}}
                      items={[
                          {
                              key: 'discountType',
                              label: <Title level={5} style={{margin: '0px 10px'}}>Loại giảm giá</Title>,
                              children: (
                                  <Radio.Group onChange={onChangeDiscountType} disabled={isErrorNetWork}>
                                      <Row>
                                          <Col key={"ALL"} span={24} style={{marginBottom: 10}}>
                                              <Radio value={undefined} style={{marginLeft: 10}}>Tất cả</Radio>
                                          </Col>

                                          {Object.keys(DISCOUNT_TYPE).map((key) => (
                                              <Col key={key} span={24} style={{marginBottom: 10}}>
                                                  <Radio value={key} style={{marginLeft: 10}}>
                                                      {DISCOUNT_TYPE[key as keyof typeof DISCOUNT_TYPE].description}
                                                  </Radio>
                                              </Col>
                                          ))}
                                      </Row>
                                  </Radio.Group>
                              ),
                          },
                      ]}
            />
        </Space>
    );
};

export default memo(VoucherFilter);
