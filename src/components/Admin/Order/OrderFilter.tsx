"use client"
import React, {CSSProperties, memo, useState} from "react";
import {
    Button,
    Checkbox,
    Col,
    Collapse, CollapseProps,
    DatePicker,
    DatePickerProps, Dropdown, Flex,
    type GetProp, GetProps, MenuProps,
    Radio,
    RadioChangeEvent,
    Row,
    Space,
    Typography
} from "antd";
import {ORDER_CHANEL} from "@/constants/OrderChanel";
import {ORDER_STATUS} from "@/constants/OrderStatus";
import ExtraShowTotalElementFilter from "@/components/Filter/ExtraShowTotalElementFilter";
import {ParamFilterOrder} from "@/components/Admin/Order/hooks/useFilterOrder";
import {MoreOutlined} from "@ant-design/icons";


const {Title} = Typography;
const {RangePicker} = DatePicker;
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const orderStatusCount = Object.keys(ORDER_STATUS).length;

const collapseFilterPanel = {
    time_created: "Thời gian",
    order_status: "Trạng thái",
    order_channel: "Kênh bán hàng",
    payment_method: "Phương thức thanh toán"
};
const collapseKeys = Object.keys(collapseFilterPanel);

const panelStyle: React.CSSProperties = {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)',
    border: 'none',
};

interface IProps {
    filterParam: ParamFilterOrder;
    setFilterParam: React.Dispatch<React.SetStateAction<ParamFilterOrder>>;
}

const OrderFilter: React.FC<IProps> = (props) => {
    const {filterParam, setFilterParam} = props;

    const [activePanels, setActivePanels] = useState<string[]>(collapseKeys);
    const [checkedOrderStatus, setCheckedOrderStatus] = useState<string[]>([]);

    const onChangeMonth: DatePickerProps['onChange'] = (date, dateString) => {
        if (date) {
            // console.log(date.year())
            // console.log(date.month())
            setFilterParam((prevValue) => {
                return {
                    ...prevValue,
                    page: 1,
                    month: date.month() + 1,
                    year: date.year()
                }
            });
        } else {
            setFilterParam((prevValue) => {
                return {
                    ...prevValue,
                    page: 1,
                    month: undefined,
                    year: undefined
                }
            });
        }
    };

    const onChangeDate: RangePickerProps['onChange'] = (dates, dateStrings) => {
        if (dateStrings && dateStrings[0] && dateStrings[1]) {
            console.log(dateStrings)
            setFilterParam((prevValue) => {
                return {
                    ...prevValue,
                    page: 1,
                    startDate: dateStrings[0],
                    endDate: dateStrings[1]
                }
            });
        } else {
            setFilterParam((prevValue) => {
                return {
                    ...prevValue,
                    page: 1,
                    startDate: undefined,
                    endDate: undefined
                }
            });
        }
    };

    const onChangeOrderStatusFilter: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any[]) => {
        setCheckedOrderStatus(checkedValues);
        if (checkedValues.length > 0 && checkedValues.length < orderStatusCount) {
            setFilterParam((prevValue) => {
                return {
                    ...prevValue,
                    page: 1,
                    orderStatus: checkedValues.toString()
                }
            });
        } else {
            setFilterParam((prevValue) => ({...prevValue, orderStatus: undefined}));
        }
    };

    const onChangeOrderChannelFilter = (e: RadioChangeEvent) => {
        const {value} = e.target;
        setFilterParam((prevValue: ParamFilterOrder) => {
            return {
                ...prevValue,
                page: 1,
                orderChannel: value ? value : undefined
            }
        });
    };

    const handleClearAllFilter = () => {
        setCheckedOrderStatus([]);
        setFilterParam({
            page: 1,
            size: 10,
            keyword: undefined,
            startDate: undefined,
            endDate: undefined,
            month: undefined,
            year: undefined,
            orderStatus: undefined,
            orderChannel: undefined,
            paymentMethod: undefined,
        })
    }

    // Hàm thay đổi trạng thái mở/tắt của từng Collapse
    const onCollapseChange = (key: string | string[]) => {
        console.log(key)
        setActivePanels(prev => {
            if (Array.isArray(key)) return key;  // Trường hợp đóng/mở toàn bộ
            return prev.includes(key)
                ? prev.filter(panelKey => panelKey !== key)  // Nếu đang mở, đóng lại
                : [...prev, key];  // Nếu đang đóng, mở ra
        });
    };

    // Hàm mở/đóng tất cả collapse
    const toggleAllCollapse = () => {
        setActivePanels(prev => (prev.length === 0 ? collapseKeys : []));
    };

    const itemsMoreFilter: MenuProps['items'] = [
        {
            key: "clear-filter",
            label: "Xóa hết lựa chọn lọc",
            onClick: () => handleClearAllFilter()
        },
        {
            key: "close-all-collapse",
            label: activePanels.length > 0 ? "Đóng tất cả" : "Mở tất cả",
            onClick: () => toggleAllCollapse(),
        },
    ];

    const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
        {
            key: "time_created",
            label: <Title level={5} style={{marginBottom: 0}}>{collapseFilterPanel.time_created}</Title>,
            style: panelStyle,
            children: (
                <div>
                    <DatePicker
                        style={{width: "100%", marginBottom: 10}}
                        onChange={onChangeMonth}
                        picker="month"
                        placeholder="Chọn tháng"
                    />
                    <RangePicker
                        placeholder={["Từ ngày", "Đến ngày"]}
                        onChange={onChangeDate}
                    />
                </div>
            ),
        },
        {
            key: "order_status",
            label: <Title level={5} style={{marginBottom: 0}}>{collapseFilterPanel.order_status}</Title>,
            style: panelStyle,
            extra: (
                <ExtraShowTotalElementFilter
                    show={checkedOrderStatus.length > 0 ? true : false}
                    propsBadge={{
                        count: checkedOrderStatus.length,
                        color: "blue"
                    }}
                />
            ),
            children: (
                <div style={{maxHeight: 400, overflow: "auto"}}>
                    <Checkbox.Group
                        value={checkedOrderStatus}
                        onChange={onChangeOrderStatusFilter}
                        style={{marginLeft: 10}}
                    >
                        <Row>
                            {Object.keys(ORDER_STATUS).map((key: string) => {
                                const status = ORDER_STATUS[key as keyof typeof ORDER_STATUS];
                                return (
                                    <Col span={24} key={status.id} style={{marginBottom: 10}}
                                    >
                                        <Checkbox value={status.id}>
                                            {status.description}
                                        </Checkbox>
                                    </Col>
                                )
                            })}
                        </Row>
                    </Checkbox.Group>
                </div>
            ),
        },
        {
            key: "order_channel",
            label: <Title level={5} style={{marginBottom: 0}}>{collapseFilterPanel.order_channel}</Title>,
            style: panelStyle,
            children: (
                <Radio.Group
                    onChange={onChangeOrderChannelFilter}
                    value={filterParam?.orderChannel}
                    style={{marginLeft: 10}}
                >
                    <Row>
                        <Col key={"ALL"} span={24} style={{marginBottom: 10}}>
                            <Radio value={undefined}>Tất cả</Radio>
                        </Col>
                        {Object.keys(ORDER_CHANEL).map((key) => (
                            <Col key={key} span={24} style={{marginBottom: 10}}>
                                <Radio value={key}>
                                    {ORDER_CHANEL[key as keyof typeof ORDER_CHANEL].description}
                                </Radio>
                            </Col>
                        ))}
                    </Row>
                </Radio.Group>
            ),
        },
    ];

    return (
        <Space direction="vertical" style={{minWidth: 256}}>
            <Flex justify="space-between">
                <Title level={4} style={{marginBottom: 0}}>Bộ lọc</Title>
                <Dropdown menu={{items: itemsMoreFilter}} placement="bottomRight">
                    <Button type="text" shape="circle">
                        <MoreOutlined/>
                    </Button>
                </Dropdown>
            </Flex>

            <Collapse
                ghost
                bordered={false}
                expandIconPosition="end"
                collapsible="icon"
                style={{maxWidth: 256}}
                activeKey={activePanels}
                items={getItems(panelStyle)}
                onChange={onCollapseChange}
            />
        </Space>
    );
}
export default memo(OrderFilter);