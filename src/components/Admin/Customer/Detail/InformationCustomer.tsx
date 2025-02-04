import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
} from "antd";
import { GENDER_KEY } from "@/constants/Gender";
import { STATUS } from "@/constants/Status";
import useAppNotifications from "@/hooks/useAppNotifications";
import React, { useEffect, useState } from "react";
import { updateCustomer } from "@/services/CustomerService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { usePhoneValidation } from "@/hooks/usePhoneNumberValidation";
import { useEmailValidation } from "@/hooks/useEmailValidation";

interface IProps {
  customer: ICustomer;
  mutate: any;
}

dayjs.extend(utc);

const InformationCustomer = (props: IProps) => {
  const { customer, mutate } = props;
  console.log(customer);

  const { showNotification } = useAppNotifications();
  const [form] = Form.useForm();
  const { validatePhoneNumber } = usePhoneValidation();
  const { validateEmail } = useEmailValidation();
  const [isEditing, setIsEditing] = useState(false); // Quản lý trạng thái chỉnh sửa

  const onFinish = async (value: any) => {
    console.log(value);
    try {
      if (customer) {
        const data = {
          ...value,
          dateOfBirth: value.dateOfBirth
            ? value.dateOfBirth.format("YYYY-MM-DD")
            : null,
          id: customer.id,
        };
        console.log(data);

        const result = await updateCustomer(data);

        mutate();
        if (result.data) {
          //   handleCloseUpdateModal();
          showNotification("success", { message: result.message });
          setIsEditing(false);
        }
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage && typeof errorMessage === "object") {
        Object.entries(errorMessage).forEach(([field, message]) => {
          showNotification("error", { message: String(message) });
        });
      } else {
        showNotification("error", {
          message: "Cập nhật khách hàng thất bại",
          description: errorMessage,
        });
      }
    }
  };

  useEffect(() => {
    console.log(customer);
    
    if (customer) {
      form.setFieldsValue({
        id: customer.id,
        fullName: customer.fullName,
        dateOfBirth: customer.dateOfBirth
          ? dayjs.utc(customer.dateOfBirth)
          : "",
        gender: customer.gender,
        phoneNumber: customer.phoneNumber,
        status: customer.status,
        email: customer.email,
      });
      // console.log("customer.address:", customer.address);
      console.log(customer);
    }
    // Cập nhật lại form khi param thay đổi
  }, [customer]);

  return (
    <div className="flex items-center">
      <div className="text-center mt-[-50px] mx-[80px]">
        <Avatar size={200} icon={<UserOutlined />} />
        <div className="mt-5">
          <a onClick={() => setIsEditing(true)}>Cập nhật thông tin</a>
        </div>
      </div>
      {/* <div className="mt-5 text-sm font-semibold"> */}
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="w-full max-w-xl"
      >
        <Form.Item
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>
        <Form.Item
          label="Sdt"
          name="phoneNumber"
          rules={[
            {
              validator: (_, value) => validatePhoneNumber(value),
              required: true,
            },
          ]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
              message: 'Email không đúng định dạng!',
          },
          ]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>
        <Row gutter={[10, 20]} justify="space-between">
          <Col xs={12} md={12}>
            <Form.Item
              label="Ngày sinh"
              name="dateOfBirth"
              rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                allowClear={false} // Ngăn xóa giá trị ngày
                disabled={!isEditing}
                placeholder="Chọn ngày"
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select
                disabled={!isEditing}
                options={(
                  Object.keys(GENDER_KEY) as Array<keyof typeof GENDER_KEY>
                ).map((key) => ({ value: key, label: GENDER_KEY[key] }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="status"
          label="Trạng thái"
          // rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select
            disabled={!isEditing}
            options={(Object.keys(STATUS) as Array<keyof typeof STATUS>).map(
              (key) => ({ value: key, label: STATUS[key] })
            )}
          />
        </Form.Item>
        {isEditing && (
          <div className="flex justify-end">
            <Button htmlType="submit" type="primary">
              Lưu thay đổi
            </Button>
          </div>
        )}
      </Form>
    </div>
    // </div>
  );
};

export default InformationCustomer;
