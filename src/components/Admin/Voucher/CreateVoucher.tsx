"use client";
import React, {memo, useState} from 'react';
import {Form, Input, Modal, notification, Select, DatePicker, InputNumber, Row, Col, Radio, Space, message} from 'antd';
import {createVoucher} from '@/services/VoucherService';
import {EuroOutlined, PercentageOutlined} from '@ant-design/icons';
import useAppNotifications from "../../../hooks/useAppNotifications";
import {DISCOUNT_TYPE, DISCOUNTTYPE_KEYS} from "../../../constants/DiscountType";
import dayjs from "dayjs";

const {Option} = Select;

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (value: boolean) => void;
    mutate: any;
}

const CreateVoucher = (props: IProps) => {
    const {showNotification} = useAppNotifications();
    const {isCreateModalOpen, setIsCreateModalOpen, mutate} = props;
    const [form] = Form.useForm();
    const [isCash, setIsCash] = useState(false);

    const handleValuesChange = (changedValues: any, allValues: any) => {
        if (changedValues.discountType) {
            setIsCash(changedValues.discountType === "CASH");

            if (changedValues.discountType === "CASH" && allValues.discountValue) {
                // Tự động gán giá trị giảm giá sang giảm giá tối đa
                form.setFieldsValue({ maxDiscount: allValues.discountValue });
            }
            if (changedValues.discountType === "PERCENTAGE") {
                // Đặt lại giá trị giảm tối đa về null (hoặc giá trị mặc định) khi chọn phần trăm
                form.setFieldsValue({ maxDiscount: null });
            }
        }

        if (changedValues.discountValue && allValues.discountType === "CASH") {
            // Cập nhật giảm giá tối đa khi giá trị giảm thay đổi và kiểu là tiền mặt
            form.setFieldsValue({ maxDiscount: changedValues.discountValue });
        }
    };

    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };

    const onFinish = async (value: IVoucher) => {
        try {
            const result = await createVoucher(value);
            mutate();
            if (result.data) {
                handleCloseCreateModal();
                showNotification("success", {message: result.message,});
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage && typeof errorMessage === 'object') {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", {message: String(message),});
                });
            } else {
                showNotification("error", {
                    message: error?.message,
                    description: errorMessage,
                });
            }
        }
    };

    return (
        <>
            <Modal
                title="Thêm mới phiếu giảm giá"
                open={isCreateModalOpen}
                onOk={() => form.submit()}
                onCancel={() => handleCloseCreateModal()}
                cancelText="Hủy"
                okText="Lưu"
                okButtonProps={{
                    style: {background: "#00b96b"},
                }}
                width={800}

                style={{body: {padding: '20px'}, top: "50px"}}
            >
                <Form
                    form={form}
                    name="createVoucher"
                    layout="vertical"
                    onFinish={onFinish}
                    onValuesChange={handleValuesChange}
                >
                    <Row gutter={16}>

                        <Col span={12}>
                            <Form.Item
                                name="voucherName"
                                label="Tên phiếu giảm giá"
                                rules={[{required: true, message: "Vui lòng nhập tên phiếu giảm giá!"}]}
                            >
                                <Input style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>


                        <Col span={12}>
                            <Form.Item
                                name="voucherCode"
                                label="Mã phiếu giảm giá"
                                rules={[{required: true, message: "Vui lòng nhập mã phiếu giảm giá!"}]}
                            >
                                <Input style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Giá trị giảm giá"
                                rules={[{required: true, message: "Vui lòng nhập giá trị giảm giá và chọn kiểu!"}]}
                            >
                                <Space.Compact style={{width: '100%'}}>
                                    <Form.Item
                                        name="discountValue"
                                        noStyle
                                        rules={[
                                            { required: true, message: "Giá trị giảm là bắt buộc!" },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (getFieldValue("discountType") === "PERCENTAGE" && value > 100) {
                                                        return Promise.reject(new Error("Giá trị giảm không được vượt quá 100%"));
                                                    }
                                                    return Promise.resolve();
                                                },
                                            }),
                                        ]}
                                    >
                                        <InputNumber style={{width: '65%'}} placeholder="Giá trị giảm"/>
                                    </Form.Item>
                                    <Form.Item
                                        name="discountType"
                                        noStyle
                                        rules={[{required: true, message: "Kiểu giảm là bắt buộc!"}]}
                                    >
                                        <Select
                                            style={{width: '35%'}}
                                            placeholder="Chọn kiểu"
                                            suffixIcon={null}
                                        >
                                            {Object.keys(DISCOUNT_TYPE).map((key) => (
                                                <Option key={key} value={key}>
                                                    {DISCOUNT_TYPE[key as keyof typeof DISCOUNT_TYPE].description}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Space.Compact>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="maxDiscount"
                                label="Giảm tối đa"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập giảm giá tối đa!",
                                    }
                                ]}
                            >
                                <InputNumber style={{ width: '100%' }} readOnly={isCash} />
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row gutter={16}>

                        <Col span={12}>
                            <Form.Item
                                name="startDate"
                                label="Ngày bắt đầu"
                                rules={[{required: true, message: "Vui lòng chọn ngày bắt đầu!"}]}
                            >
                                <DatePicker
                                    style={{width: '100%'}}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    disabledDate={current => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>

                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="endDate"
                                label="Ngày kết thúc"
                                dependencies={['startDate']}
                                rules={[
                                    {required: true, message: "Vui lòng chọn ngày kết thúc!"},
                                    ({getFieldValue}) => ({
                                        validator(_, value) {
                                            const startDate = getFieldValue("startDate");
                                            if (!value || !startDate || value.isAfter(startDate)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu!")
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    style={{width: '100%'}}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    disabledDate={current => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>

                        </Col>
                    </Row>
                    <Row gutter={16}>

                        <Col span={12}>
                            <Form.Item
                                name="minOrderValue"
                                label="Giá trị đơn hàng tối thiểu"
                                rules={[{required: true, message: "Vui lòng nhập giá trị đơn hàng tối thiểu!"},
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const discountType = getFieldValue('discountType');
                                            const discountValue = getFieldValue('discountValue') || 0;

                                            if (discountType === "CASH" && value <= discountValue) {
                                                return Promise.reject(new Error("Giá trị đơn hàng tối thiểu phải lớn hơn giá trị giảm!"));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <InputNumber style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>


                        <Col span={12}>
                            <Form.Item
                                name="usageLimit"
                                label="Số lượng "
                                rules={[{required: true, message: "Vui lòng nhập số lượng sử dụng!"}]}
                            >
                                <InputNumber style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="note"
                                label="Mô tả"
                            >
                                <Input.TextArea style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default memo(CreateVoucher);
