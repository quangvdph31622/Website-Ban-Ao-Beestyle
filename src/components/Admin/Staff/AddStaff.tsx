"use client";
import { DatePicker, Form, Input, Modal, Select } from "antd";
import React, { memo, useState } from "react";
import useAppNotifications from "@/hooks/useAppNotifications";
import { createStaff } from "@/services/StaffService";
import { usePhoneValidation } from "@/hooks/usePhoneNumberValidation";
import { useEmailValidation } from "@/hooks/useEmailValidation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  mutate: any;
}
dayjs.extend(utc);
const AddStaff = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen, mutate } = props;
  const { showNotification } = useAppNotifications();
  const { validatePhoneNumber } = usePhoneValidation();
  const {validateEmail} = useEmailValidation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const handleCancelModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const handleSubmit = async (value: any) => {
    console.log(value);
    setLoading(true)

    try {
      const data = {
        ...value,
        dateOfBirth: value.dateOfBirth
          ? value.dateOfBirth.format("YYYY-MM-DD")
          : null
      };
      const result = await createStaff(data);
      mutate();
      console.log(data);

      if (result.data) {
        handleCancelModal();
        showNotification("success", { message: result.message });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage && typeof errorMessage === "object") {
        Object.entries(errorMessage).forEach(([field, message]) => {
          showNotification("error", { message: String(message) });
        });
      } else {
        showNotification("error", {
          message: "Thêm nhân viên thất bại",
          description: errorMessage,
        });
      }
    }
    finally{
      setLoading(false)
    }
  };
  return (
    <>
      <Modal
        title={"Thêm mới nhân viên"}
        cancelText="Hủy"
        okText="Lưu"
        onOk={() => form.submit()}
        style={{ top: 20 }}
        open={isCreateModalOpen}
        onCancel={() => handleCancelModal()}
        okButtonProps={{ style: { background: "#00b96b" },loading }}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="horizontal"
          labelAlign="left"
          labelWrap
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập username!" }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập password!" }]}
          >
            <Input.Password />
          </Form.Item> */}
          <Form.Item
            label="Email"
            name="email"
            rules={[{ validator: (_, value) => validateEmail(value),required: true}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[{ validator: (_, value) => validatePhoneNumber(value),required: true}]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth"
            // rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender" initialValue="0">
            <Select
              style={{ width: "100%" }}
              placeholder="Giới tính"
              defaultValue="0"
            >
              <Select.Option value="0">Nam</Select.Option>
              <Select.Option value="1">Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            // rules={[{ required: false, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(AddStaff);
