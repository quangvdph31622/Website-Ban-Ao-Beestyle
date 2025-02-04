"use client"
import React, {memo, useRef, useState} from "react";
import {IOrderDetail} from "@/types/IOrder";
import {Badge, Button, Descriptions, DescriptionsProps, Flex, Typography} from "antd";
import dayjs from "dayjs";
import {ORDER_STATUS} from "@/constants/OrderStatus";
import {FORMAT_NUMBER_WITH_COMMAS} from "@/constants/AppConstants";
import {ORDER_TYPE} from "@/constants/OrderType";
import {PAYMENT_METHOD} from "@/constants/PaymentMethod";
import UpdateShippingInfoModal from "@/components/Admin/Order/Detail/UpdateShippingInfoModal";
import {formatAddress} from "@/utils/AppUtil";
import {ORDER_CHANEL} from "@/constants/OrderChanel";
import {PresetStatusColorType} from "antd/es/_util/colors";
import {DISCOUNT_TYPE} from "@/constants/DiscountType";
import InvoiceComponent from "@/components/User/Invoice/InvoiceComponent";

const {Text} = Typography;

const getStatusBadge = (orderStatus: string | undefined): PresetStatusColorType => {
    if (orderStatus === ORDER_STATUS.CANCELLED.key || orderStatus === ORDER_STATUS.RETURNED.key) {
        return "error";
    }

    if (orderStatus === ORDER_STATUS.PAID.key || orderStatus === ORDER_STATUS.DELIVERED.key) {
        return "success";
    }

    return "processing";
}

interface IProps {
    orderDetail: IOrderDetail
}

const OrderDetailInfoTable: React.FC<IProps> = (props) => {
    const {orderDetail} = props;
    const [isShippingInfoModalOpen, setIsShippingInfoModalOpen] = useState<boolean>(false);

    const invoiceRef = useRef<any>(null);
    const handlePrintInvoice = () => {
        if (invoiceRef.current) {
            invoiceRef.current.printInvoice();
        }
    };

    const showShippingInfoModal = () => {
        setIsShippingInfoModalOpen(true);
    };

    const itemDescriptions: DescriptionsProps['items'] = [
        {
            key: 'orderTrackingNumber', label: 'Mã hóa đơn', span: {xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1},
            children: orderDetail?.orderTrackingNumber
        },
        {
            key: 'receiverName', label: 'Người nhận', span: {xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1},
            children: orderDetail?.receiverName
        },
        {
            key: 'phoneNumber', label: 'Số điện thoại', span: {xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1},
            children: orderDetail?.phoneNumber
        },
        {
            key: 'orderType', label: 'Kênh bán hàng', span: {xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1},
            children: (
                <Badge
                    status="processing"
                    color={ORDER_CHANEL[orderDetail?.orderChannel as keyof typeof ORDER_CHANEL]?.color_tag}
                    text={ORDER_CHANEL[orderDetail?.orderChannel as keyof typeof ORDER_CHANEL]?.description}
                />
            )
        },
        {
            key: 'orderType', label: 'Loại hóa đơn', span: {xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1},
            children: (
                <Badge
                    status="processing"
                    color={
                        ORDER_TYPE[orderDetail?.orderType as keyof typeof ORDER_TYPE]?.key === ORDER_TYPE.DELIVERY.key ?
                            "yellow" : "primary"
                    }
                    text={ORDER_TYPE[orderDetail?.orderType as keyof typeof ORDER_TYPE]?.description}
                />
            )
        },

        {
            key: 'createdAt',
            label: orderDetail?.orderType === ORDER_TYPE.DELIVERY.key ? 'Ngày đặt hàng' : 'Ngày tạo hóa đơn',
            span: {xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1},
            children: dayjs(orderDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')
        },
        {
            key: 'shippingAddress', label: 'Địa chỉ nhận hàng', span: {xs: 3, sm: 3, md: 3, lg: 3, xl: 3, xxl: 3},
            children: orderDetail?.shippingAddressId && (
                <>
                    <Text style={{marginInlineEnd: 4}}>
                        {formatAddress(orderDetail?.shippingAddress)}
                    </Text>
                </>
            )
        },
        {
            key: 'paymentMethod', label: 'Hình thức thanh toán', span: {xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1},
            children: PAYMENT_METHOD[orderDetail?.paymentMethod as keyof typeof PAYMENT_METHOD]?.description
        },
        {
            key: 'isPrepaid', label: 'Trả trước', span: {xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1},
            children: (
                <Badge
                    status={orderDetail?.isPrepaid ? 'success' : 'default'}
                    text={orderDetail?.isPrepaid ? 'Đã trả trước' : 'Chưa trả trước'}
                />
            )
        },
        {
            key: 'paymentDate', label: 'Ngày thanh toán', span: {xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1},
            children: orderDetail?.paymentDate ? dayjs(orderDetail.paymentDate).format('DD-MM-YYYY HH:mm:ss') : '',
        },
        {
            key: 'shippingFee', label: 'Phí vận chuyển', span: {xs: 3, sm: 3, md: 1.5, lg: 1.5, xl: 1.5, xxl: 1.5},
            children: `${orderDetail?.shippingFee}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')
        },
        {
            key: 'totalAmount',
            label: 'Tổng tiền thanh toán',
            span: {xs: 3, sm: 3, md: 1.5, lg: 1.5, xl: 1.5, xxl: 1.5},
            children: `${orderDetail?.totalAmount}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')
        },
        {
            key: 'orderStatus', label: 'Trạng thái hóa đơn', span: {xs: 3, sm: 3, md: 3, lg: 3, xl: 3, xxl: 3},
            children: orderDetail?.orderStatus ? (
                <Badge
                    status={getStatusBadge(orderDetail?.orderStatus)}
                    text={ORDER_STATUS[orderDetail?.orderStatus as keyof typeof ORDER_STATUS].description}
                />
            ) : null,
        },
        {
            key: 'voucherInfo', label: 'Voucher áp dụng', span: {xs: 3, sm: 3, md: 1.5, lg: 1.5, xl: 1.5, xxl: 1.5},
            children: orderDetail?.voucherInfo && (
                <>
                    {orderDetail?.voucherInfo?.voucherCode} - {orderDetail?.voucherInfo?.voucherName}
                    <br/>
                    Loại giảm giá: {
                    orderDetail?.voucherInfo?.discountType === DISCOUNT_TYPE.PERCENTAGE.key
                        ? DISCOUNT_TYPE.PERCENTAGE.description
                        : DISCOUNT_TYPE.CASH.description
                }
                    <br/>
                    Giá trị
                    giảm: {`${orderDetail?.voucherInfo?.discountValue}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                    <br/>
                    Giá trị tiền giảm tối
                    đa: {`${orderDetail?.voucherInfo?.maxDiscount}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                    <br/>
                    Giá trị hóa đơn tối thiểu áp
                    dụng: {`${orderDetail?.voucherInfo?.minOrderValue}`.replace(FORMAT_NUMBER_WITH_COMMAS, ',')}
                    <br/>
                    Thời gian: từ {dayjs(orderDetail?.voucherInfo?.startDate).format('DD-MM-YYYY')} đến
                    hết {dayjs(orderDetail?.voucherInfo?.endDate).format('DD-MM-YYYY')}
                </>
            ),
        },
        {
            key: 'note',
            label: 'Ghi chú',
            span: {xs: 3, sm: 3, md: 1.5, lg: 1.5, xl: 1.5, xxl: 1.5},
            children: orderDetail?.note
        },
        {
            key: 'customerInfo', label: 'Khách hàng', span: {xs: 3, sm: 3, md: 1.5, lg: 1.5, xl: 1.5, xxl: 1.5},
            children: (
                <>
                    {
                        orderDetail?.customerInfo ?
                            (
                                <div>
                                    <Text>Họ và tên: {orderDetail?.customerInfo?.fullName}</Text><br/>
                                    <Text>
                                        Ngày
                                        sinh: {dayjs(orderDetail?.customerInfo?.dateOfBirth).format('DD-MM-YYYY')}
                                    </Text><br/>
                                    <Text>Giới tính: {orderDetail?.customerInfo?.gender}</Text><br/>
                                    <Text>Số điện thoại: {orderDetail?.customerInfo?.phoneNumber}</Text><br/>
                                    <Text>Email: {orderDetail?.customerInfo?.email}</Text>
                                </div>
                            )
                            :
                            (
                                <Text>Khách lẻ</Text>
                            )
                    }
                </>
            ),
        },
        {
            key: 'staffInfo', label: 'Nhân viên', span: {xs: 3, sm: 3, md: 1.5, lg: 1.5, xl: 1.5, xxl: 1.5},
            children: (
                <>
                </>
            ),
        },
    ];

    return (
        <>
            <Flex justify="flex-end">
                {/*{*/}
                {/*    orderDetail?.orderType === ORDER_TYPE.DELIVERY.key &&*/}
                {/*    orderDetail?.orderStatus === ORDER_STATUS.AWAITING_CONFIRMATION.key &&*/}
                {/*    <Tooltip title="Cập nhật thông tin giao hàng" placement="topRight">*/}
                {/*        <Button type="primary" style={{marginBottom: 10}} onClick={() => showShippingInfoModal()}>*/}
                {/*            Cập nhật*/}
                {/*        </Button>*/}
                {/*    </Tooltip>*/}
                {/*}*/}

                {
                    !(orderDetail?.orderStatus === ORDER_STATUS.PENDING.key) &&
                    !(orderDetail?.orderStatus === ORDER_STATUS.AWAITING_CONFIRMATION.key) &&
                    !(orderDetail?.orderStatus === ORDER_STATUS.CANCELLED.key) &&
                    !(orderDetail?.orderStatus === ORDER_STATUS.RETURNED.key) &&
                    <Button type="primary" style={{marginBottom: 10}} onClick={handlePrintInvoice}>
                        In Hóa Đơn
                    </Button>
                }
            </Flex>

            <Descriptions
                bordered
                column={{xs: 3, sm: 3, md: 3, lg: 3, xl: 3, xxl: 3}}
                items={itemDescriptions}
            />

            <UpdateShippingInfoModal
                isShippingInfoModalOpen={isShippingInfoModalOpen}
                setIsShippingInfoModalOpen={setIsShippingInfoModalOpen}
            />

            <InvoiceComponent ref={invoiceRef} id={orderDetail?.id || null}/>
        </>

    )
}
export default memo(OrderDetailInfoTable);
