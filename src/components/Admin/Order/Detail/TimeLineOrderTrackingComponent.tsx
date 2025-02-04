import React, {memo, useEffect, useState} from "react";
import {Button, Divider, Form, Input, Modal, StepProps, Steps, Typography} from "antd";
import {
    CheckOutlined,
    DropboxOutlined,
    ExclamationCircleFilled,
    LoadingOutlined
} from "@ant-design/icons";
import {LiaBoxSolid} from "react-icons/lia";
import {FaShippingFast} from "react-icons/fa";
import {IOrderDetail} from "@/types/IOrder";
import {ORDER_TYPE} from "@/constants/OrderType";
import {ORDER_STATUS} from "@/constants/OrderStatus";
import useAppNotifications from "@/hooks/useAppNotifications";
import useOrder from "@/components/Admin/Order/hooks/useOrder";
import {useOrderDetailContext} from "@/components/Admin/Order/Detail/Context/OrderDetailProvider";

const {Text} = Typography;

interface IProps {
    orderDetail: IOrderDetail,
    mutate: any
}

/**
 * Đơn hàng bán giao hàng
 * @param orderStatus truyền trạng thái đơn hàng
 * @return vị trí step timeline icon của component cho hóa đơn giao
 */
const getOrderDeliverySaleStep = (orderStatus: string | undefined): number => {
    switch (orderStatus) {
        case ORDER_STATUS.CONFIRMED.key:
            return 1; // Đã xác nhận
        case ORDER_STATUS.AWAITING_SHIPMENT.key:
            return 2; // Chờ giao hàng
        case ORDER_STATUS.OUT_FOR_DELIVERY.key:
            return 3; // Đang giao hàng
        case ORDER_STATUS.DELIVERED.key:
            return 4; // Hoàn thành giao hàng
        case ORDER_STATUS.CANCELLED.key:
            return -1; // Đã hủy
        case ORDER_STATUS.RETURNED.key:
            return -2; // Đã trả hàng
        default:
            return 0; // Đặt hàng
    }
};

const getUpdateNextValueOrderStatus = (currentStatus: string): string => {
    // Map trạng thái và trạng thái tiếp theo
    const statusFlow = {
        [ORDER_STATUS.AWAITING_CONFIRMATION.key]: ORDER_STATUS.CONFIRMED.key, // Chờ xác nhận -> Đã xác nhận
        [ORDER_STATUS.CONFIRMED.key]: ORDER_STATUS.AWAITING_SHIPMENT.key, // Đã xác nhận -> Chờ giao hàng
        [ORDER_STATUS.AWAITING_SHIPMENT.key]: ORDER_STATUS.OUT_FOR_DELIVERY.key, // Chờ giao hàng -> Đang giao hàng
        [ORDER_STATUS.OUT_FOR_DELIVERY.key]: ORDER_STATUS.DELIVERED.key, // Đang giao hàng -> Đã giao hàng
    };

    // Trả về trạng thái tiếp theo nếu tồn tại, nếu không giữ nguyên
    return (statusFlow as { [key: string]: string })[currentStatus] || currentStatus;
};


/**
 * Đơn hàng bán trực tiếp
 * @param orderStatus truyền trạng thái đơn hàng
 * @return vị trí step timeline icon của component cho hóa đơn tại quầy
 */
const getCounterBillStep = (orderStatus: string | undefined): number => {
    switch (orderStatus) {
        case ORDER_STATUS.PAID.key:
            return 1; // Đã thanh toán
        case ORDER_STATUS.PENDING.key:
            return 0; // Chờ thanh toán
        default:
            return 0; // Chờ thanh toán
    }
};

const getStepStatus = (stepKey: number, current: number) => {
    if (current === -1) return "error"; // Trạng thái hủy
    if (stepKey === current) return "process"; // Đang thực hiện
    if (stepKey < current) return "finish"; // Đã hoàn thành
    return "wait"; // Chưa đến
};

const TimeLineOrderTrackingComponent: React.FC<IProps> = (props) => {
    const {orderDetail, mutate} = props;
    const {showModal, showNotification} = useAppNotifications();
    const orderDetailContext = useOrderDetailContext();
    const [form] = Form.useForm();
    const {handleUpdateOrderStatusDelivery} = useOrder();
    const [current, setCurrent] = useState<number>(getOrderDeliverySaleStep(orderDetail?.orderStatus));
    const [isOpenReasonModal, setIsOpenReasonModal] = useState(false);
    const [actionType, setActionType] = useState<'cancel' | 'return' | null>(null);

    useEffect(() => {
        // dựa vào loại hóa đơn để hiển thị time line theo dõi trạng thái hóa đơn
        const step: number = orderDetail?.orderType === ORDER_TYPE.IN_STORE_PURCHASE.key
            ? getCounterBillStep(orderDetail?.orderStatus)
            : getOrderDeliverySaleStep(orderDetail?.orderStatus);
        setCurrent(step);
    }, [orderDetail?.orderStatus]);

    /**
     * show modal nhập lý do hủy và k nhận hàng
     * @param type
     */
    const showModalCancelledOrReturned = (type: 'cancel' | 'return') => {
        setActionType(type);
        setIsOpenReasonModal(true);
    };

    const handleSubmitReasonCancelledAndReturned = async () => {
        if (actionType === 'cancel') {
            await handleConfirmStepOrderStatus(orderDetail?.id, {
                orderStatus: ORDER_STATUS.CANCELLED.key,
                note: form.getFieldValue('note')
            });
        } else if (actionType === 'return') {
            await handleConfirmStepOrderStatus(orderDetail?.id, {
                orderStatus: ORDER_STATUS.RETURNED.key,
                note: form.getFieldValue('note')
            });
        }
        setIsOpenReasonModal(false);

        // refresh order detail
        await mutate();
    };

    /**
     * xử lý khi đóng form hủy hoặc không nhận hàng
     */
    const handleCancel = () => {
        setIsOpenReasonModal(false);
        form.resetFields();
    };

    /**
     * xử lý qua các trạng thái đơn hàng
     * @param id
     * @param value
     */
    const handleConfirmStepOrderStatus = async (id: number, value: {
        shippingFee?: number,
        totalAmount?: number,
        orderStatus: string,
        note: string | undefined
    }) => {
        console.log(value)
        try {
            if (value.orderStatus === ORDER_STATUS.CONFIRMED.key) {
                await handleUpdateOrderStatusDelivery(
                    id, {
                        ...value,
                        shippingFee: orderDetailContext?.paymentInfo.shippingFee,
                        totalAmount: orderDetailContext?.paymentInfo.finalTotalAmount,
                    });
            } else {
                await handleUpdateOrderStatusDelivery(id, value);
            }
            await mutate();
        } catch (error) {
            showNotification("error", {
                message: "Lỗi",
                description: "Không thể cập nhật trạng thái đơn hàng.",
            });
        }
    };

    /**
     * comfirm xác nhận chuyển trạng thái
     */
    const modalConfirmChangeOrderStatus = () => {
        return showModal("confirm", {
            title: "Xác nhận thay đổi trạng thái đơn hàng ?",
            icon: <ExclamationCircleFilled/>,
            width: 500,
            content: (
                <div style={{margin: "20px 0px"}}>
                    <Text strong>
                        {orderDetail?.orderStatus
                            ? getUpdateNextValueOrderStatus(orderDetail.orderStatus) || ""
                            : ""
                        }
                    </Text>
                </div>
            ),
            onOk() {
                const nextStatus = orderDetail?.orderStatus ? getUpdateNextValueOrderStatus(orderDetail?.orderStatus) : "";

                // Nếu trạng thái thay đổi, gửi yêu cầu cập nhật
                if (nextStatus !== orderDetail?.orderStatus) {
                    handleConfirmStepOrderStatus(orderDetail?.id, {
                        orderStatus: nextStatus,
                        note: undefined,
                    });
                } else {
                    showNotification("info", {
                        message: "Trạng thái hiện tại không thay đổi.",
                    });
                }
            },
            onCancel() {
            },
        });
    };


    // time line cho giao hàng
    const itemTrackingOrderDeliverySaleSteps: StepProps[] = [
        {
            title: "Đặt hàng",
            status: getStepStatus(0, current),
            icon: <DropboxOutlined style={{fontSize: 35}}/>,
        },
        {
            title: current >= 1 ? ORDER_STATUS.CONFIRMED.description : ORDER_STATUS.AWAITING_CONFIRMATION.description,
            status: current >= 1 ? (current === 1 ? "process" : "finish") : "wait",
            icon: current < 1 ? <LoadingOutlined style={{fontSize: 35}}/> : <CheckOutlined style={{fontSize: 35}}/>
        },
        {
            title: ORDER_STATUS.AWAITING_SHIPMENT.description,
            status: getStepStatus(2, current),
            icon: <LiaBoxSolid style={{fontSize: 35}}/>
        },
        {
            title: ORDER_STATUS.OUT_FOR_DELIVERY.description,
            status: getStepStatus(3, current),
            icon: <FaShippingFast style={{fontSize: 35}}/>
        },
        {
            title: ORDER_STATUS.DELIVERED.description,
            status: getStepStatus(4, current),
            icon: <CheckOutlined style={{fontSize: 35}}/>
        }
    ];

    // time line cho đơn hàng tại quầy
    const itemTrackingCounterBillSteps: StepProps[] = [
        {
            title: current === 0 ? "Chờ thanh toán" : "Đã thanh toán",
            status: getStepStatus(0, current),
            icon: current === 0 ? <LoadingOutlined style={{fontSize: 35}}/> : <CheckOutlined style={{fontSize: 35}}/>
        },
        {
            title: 'Hoàn thành',
            status: getStepStatus(1, current),
            icon: <CheckOutlined style={{fontSize: 35}}/>
        }
    ];

    return (
        <>
            <Steps
                current={current}
                items={
                    orderDetail?.orderType === ORDER_TYPE.IN_STORE_PURCHASE.key
                        ? itemTrackingCounterBillSteps
                        : itemTrackingOrderDeliverySaleSteps
                }
                style={{margin: "20px 0px 30px 0px"}}
            />
            {
                orderDetail?.orderType === ORDER_TYPE.DELIVERY.key &&
                <div>
                    <Divider/>
                    {/* Xác nhận thay đổi trạng thái */}
                    {orderDetail?.orderStatus &&
                        (orderDetail.orderStatus === ORDER_STATUS.AWAITING_CONFIRMATION.key ||
                        orderDetail.orderStatus === ORDER_STATUS.CONFIRMED.key ||
                        orderDetail.orderStatus === ORDER_STATUS.AWAITING_SHIPMENT.key ||
                        orderDetail.orderStatus === ORDER_STATUS.OUT_FOR_DELIVERY.key) && (
                        <Button type="primary" onClick={modalConfirmChangeOrderStatus}>
                            Xác nhận
                        </Button>
                    )}

                    {/* Button sau hoàn thành thanh toán */}
                    {orderDetail?.orderStatus &&
                        orderDetail.orderStatus === ORDER_STATUS.DELIVERED.key && (
                        <Button type="primary" disabled={true}>
                            Hoàn thành
                        </Button>
                    )}

                    {/* Hủy đơn hàng trong trước khi hoàn thành thanh toán */}
                    {
                        orderDetail?.orderStatus && orderDetail.orderStatus === ORDER_STATUS.OUT_FOR_DELIVERY.key
                            ? (
                                <Button style={{margin: '0 8px'}} onClick={() => showModalCancelledOrReturned("return")}>
                                    Hủy giao hàng
                                </Button>
                            )
                            :
                            orderDetail?.orderStatus &&
                            (orderDetail.orderStatus === ORDER_STATUS.AWAITING_CONFIRMATION.key ||
                            orderDetail.orderStatus === ORDER_STATUS.CONFIRMED.key ||
                            orderDetail.orderStatus === ORDER_STATUS.AWAITING_SHIPMENT.key)
                                ? (
                                    <Button style={{margin: '0 8px'}}
                                            onClick={() => showModalCancelledOrReturned("cancel")}>
                                        Hủy
                                    </Button>
                                )
                                :
                                <></>
                    }
                </div>
            }


            <Modal cancelText="Hủy" okText="Xác nhận lý do"
                   title={actionType === 'cancel' ? 'Lý do hủy đơn hàng' : 'Lý do trả hàng'}
                   open={isOpenReasonModal}
                   onOk={() => form.submit()}
                   onCancel={handleCancel}
                   width={700}
                   styles={{
                       body: {
                           padding: "10px 0px",
                           height: 195
                       }
                   }}
            >
                <Form
                    form={form}
                    name="reason"
                    onFinish={handleSubmitReasonCancelledAndReturned}
                >
                    <Form.Item
                        layout="vertical"
                        label="Ghi chú"
                        name="note"
                        rules={[
                            {
                                required: true,
                                message: `Vui lòng nhập lý do ${actionType === 'cancel' ? 'hủy đơn hàng' : 'trả hàng'}.`
                            }
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Nhập lý do..."
                            rows={6}
                            autoSize={{minRows: 6, maxRows: 6}}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
export default memo(TimeLineOrderTrackingComponent);