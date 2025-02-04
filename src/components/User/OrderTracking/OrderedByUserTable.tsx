import React, {useState} from 'react';
import {Button, PaginationProps, Table, TableColumnsType, Tag, Tooltip} from 'antd';
import {EyeOutlined} from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import {IOrderedByUser} from "@/types/IOrder";
import {FORMAT_NUMBER_WITH_COMMAS} from "@/constants/AppConstants";
import {ORDER_CHANEL} from "@/constants/OrderChanel";
import {ORDER_TYPE} from "@/constants/OrderType";
import Link from "next/link";
import useOrder from "@/components/Admin/Order/hooks/useOrder";
import {ORDER_STATUS} from "@/constants/OrderStatus";

interface IProps {
    idCustomer: any;
}

const OrderedByUserTable = (props: IProps) => {
    const {idCustomer} = props;
    const [page, setPage] = useState<number>(1);
    const {handleGetOrderByCustomer} = useOrder();

    const {orderedByUser, isLoading, error, mutate} =
        handleGetOrderByCustomer(idCustomer, 5, page);

    const onChange: PaginationProps['onChange'] = (page, pageSize) => {
        setPage(page);
    }

    const columns: TableColumnsType<IOrderedByUser> = [
        {title: 'Mã hóa đơn', dataIndex: 'orderTrackingNumber', key: 'orderTrackingNumber', width: 200},
        {
            title: 'Trạng thái', dataIndex: 'orderStatus', key: 'orderStatus', align: 'center', width: 200,
            render(value: keyof typeof ORDER_STATUS, record) {
                const statusName: string = ORDER_STATUS[value].description;
                const color: string = ORDER_STATUS[value]?.color_tag ?? "default";
                return <Tag color={color}>{statusName}</Tag>;
            }
        },
        {
            title: 'Kênh bán hàng', dataIndex: 'orderChannel', key: 'orderChannel', align: 'center',  width: 150,
            render(value: keyof typeof ORDER_CHANEL, record) {
                let color: string = ORDER_CHANEL[value]?.color_tag ?? "default";
                return (<Tag color={color}>{ORDER_CHANEL[value].description}</Tag>);
            }
        },
        {
            title: 'Loại', dataIndex: 'orderType', key: 'orderType', align: 'center',
            render(value: keyof typeof ORDER_TYPE, record) {
                let color: string = ORDER_TYPE[value]?.color_tag ?? "default";
                return (<Tag color={color}>{ORDER_TYPE[value].description}</Tag>);
            }
        },
        {
            title: 'Tổng tiền thanh toán', dataIndex: 'totalAmount', key: 'totalAmount', align: 'right', width: 180,
            render: (_, record) => `${record.totalAmount}`.replace(FORMAT_NUMBER_WITH_COMMAS, ",")
        },
        {
            title: '', key: 'action', align: 'center', width: 50,
            render: (value, record) => (
                <Tooltip placement="top" title="Chi tiết">
                    <Link href={`/order-tracking/${record.orderTrackingNumber}`}>
                        <Button
                            type="default"
                            icon={<EyeOutlined/>}
                            className="!border-none !text-white !bg-purple-500 hover:!bg-purple-600"
                        >
                        </Button>
                    </Link>
                </Tooltip>
            ),
        },
    ];

    return (
        <>
            {orderedByUser?.items && orderedByUser.items.length > 0 ? (
                <div>
                    <Title level={4} className="font-semibold mt-5">Đơn hàng đã đặt</Title>
                    <Table
                        dataSource={orderedByUser?.items}
                        columns={columns}
                        pagination={{
                            pageSize: 5,
                            current: orderedByUser?.pageNo,
                            onChange: onChange,
                            showSizeChanger: false,
                            total: orderedByUser?.totalElements,
                        }}
                        bordered
                    />
                </div>
            ) : (
                <div
                    className='mt-5'
                    style={{border: '8px solid #D9EDF7'}}
                >
                    <span className='block p-2'>Bạn chưa đặt đơn hàng nào.</span>
                </div>
            )}
        </>
    );
};

export default OrderedByUserTable;
