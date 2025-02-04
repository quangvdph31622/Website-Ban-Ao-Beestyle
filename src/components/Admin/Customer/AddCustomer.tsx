"use client";
import { Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { memo, useCallback, useState } from "react";
import { createCustomer } from "@/services/CustomerService";
import useAppNotifications from "@/hooks/useAppNotifications";
import { createAddress } from "@/services/AddressService";
import useAddress from "../Address/hook/useAddress";
import SelectSearchOptionLabel from "@/components/Select/SelectSearchOptionLabel";
import { usePhoneValidation } from "@/hooks/usePhoneNumberValidation";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import { useEmailValidation } from "@/hooks/useEmailValidation";

const { Option } = Select;

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  mutate: any;
}
dayjs.extend(utc);

const AddCustomer = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen, mutate } = props;
  const { showNotification } = useAppNotifications();
  const { validatePhoneNumber } = usePhoneValidation();
  const { validateEmail } = useEmailValidation();
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<
    string | null
  >(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<
    string | null
  >(null);
  const [selectedWardCode, setSelectedWardsCode] = useState<string | null>(
    null
  );

  const [selectedProvinceName, setSelectedProvinceName] = useState<
    string | null
  >(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState<
    string | null
  >(null);
  const [selectedWardName, setSelectedWardName] = useState<string | null>(null);
  const [selectedAddressDetail, setSelectedAddressDetail] = useState<
    string | null
  >(null);

  const { handleGetProvinces, handleGetDistricts, handleGetWards } =
    useAddress();
  const provincesData = handleGetProvinces();
  const districtsData = handleGetDistricts(selectedProvinceCode);
  const wardsData = handleGetWards(selectedDistrictCode);

  const [form] = Form.useForm();

  console.log(provincesData);

  const onChangeSelectedProvince = useCallback(
    (provinceCode: string) => {
      setSelectedProvinceCode(provinceCode);
      const province = provincesData.dataOptionProvinces.find(
        (prev) => prev.key === provinceCode
      );
      setSelectedProvinceCode(provinceCode);
      form.setFieldsValue({
        province: provinceCode, // Cập nhật tỉnh
        district: undefined, // Reset huyện
        ward: undefined, // Reset xã
      });

      setSelectedProvinceName(province?.label);
      setSelectedDistrictCode(null);
      setSelectedWardsCode(null);
      setSelectedDistrictName(null);
      setSelectedWardName(null);
      console.log(provinceCode);
    },
    [provincesData]
  );

  const onChangeSelectedDistrict = useCallback(
    (districtCode: string) => {
      setSelectedDistrictCode(districtCode);
      const district = districtsData.dataOptionDistricts.find(
        (prev) => prev.key === districtCode
      );
      form.setFieldsValue({
        district: districtCode, // Cập nhật huyện trong Form
        ward: undefined, // Reset xã
      });
      setSelectedDistrictName(district?.label);
      console.log(selectedDistrictName);

      setSelectedWardsCode(null);
      setSelectedWardName(null);
      console.log(districtCode);
    },
    [districtsData]
  );

  const onChangeSelectedWard = useCallback(
    (wardCode: string) => {
      setSelectedWardsCode(wardCode);
      const ward = wardsData.dataOptionWards.find(
        (prev) => prev.key === wardCode
      );
      setSelectedWardName(ward?.label);
      console.log(selectedWardName);
      console.log(wardCode);
    },
    [wardsData]
  );

  const handleSubmit = async (values: any) => {
    const data = {
      ...values,
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.format("YYYY-MM-DD")
        : null,
    };
    setLoading(true);
    try {
      const result = await createCustomer(data);
      console.log(data.addressDetail);

      setSelectedAddressDetail(data.addressDetail);
      console.log(selectedAddressDetail);

      if (result.data) {
        const customer = result.data; // Lấy ID của khách hàng từ phản hồi

        const address = {
          addressName: values.addressDetail,
          cityCode: Number(selectedProvinceCode), // Nếu cần chuyển đổi
          city: selectedProvinceName, // Lưu tên tỉnh vào đây
          districtCode: Number(selectedDistrictCode), // Nếu cần chuyển đổi
          district: selectedDistrictName, // Lưu tên huyện vào đây
          communeCode: Number(selectedWardCode), // Cần lấy từ API nếu có
          commune: selectedWardName, // Tên xã
          isDefault: false,
          customerId : customer.id
        };

        console.log(address);

        // Gọi API để tạo địa chỉ
        try {
          await createAddress(address);
          console.log(address.customer);
          mutate();
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message;
          if (errorMessage && typeof errorMessage === "object") {
            Object.entries(errorMessage).forEach(([field, message]) => {
              showNotification("error", { message: String(message) });
            });
          } else {
            showNotification("error", {
              message: "Thêm khách hàng thất bại",
              description: errorMessage,
            });
          }
        }

        // Đóng modal và hiển thị thông báo thành công
        handleCancelModal();
        showNotification("success", { message: result.message });
      }
    } catch (error: any) {
      // Xử lý lỗi và hiển thị thông báo lỗi
      const errorMessage = error?.response?.data?.message;
      if (errorMessage && typeof errorMessage === "object") {
        Object.entries(errorMessage).forEach(([field, message]) => {
          showNotification("error", { message: String(message) });
        });
      } else {
        showNotification("error", {
          message: "Thêm khách hàng thất bại",
          description: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleCancelModal = () => {
    form.resetFields();
    setSelectedProvinceCode(null);
    setSelectedDistrictCode(null);
    setSelectedWardsCode(null);
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <Modal
        title={"Thêm mới khách hàng"}
        cancelText="Hủy"
        okText="Lưu"
        width={650}
        onOk={() => form.submit()}
        style={{ top: 20 }}
        open={isCreateModalOpen}
        onCancel={handleCancelModal}
        okButtonProps={{ style: { background: "#00b96b" }, loading }}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          labelAlign="left"
          labelWrap
        >
          {/* Họ tên và Số điện thoại */}
          <Row gutter={[16, 16]}>
            {/* Họ tên và Số điện thoại */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Họ tên"
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { validator: (_, value) => validatePhoneNumber(value), required: true},
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {/* Email và Ngày sinh */}
            <Col xs={24} md={12}>
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
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Ngày sinh" name="dateOfBirth">
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày sinh"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {/* Giới tính */}
            <Col xs={24} md={12}>
              <Form.Item label="Giới tính" name="gender" initialValue="0">
                <Select placeholder="Chọn giới tính" defaultValue="0">
                  <Option value="0">Nam</Option>
                  <Option value="1">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Chi tiết"
                name="addressDetail"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ chi tiết!",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Nhập địa chỉ chi tiết"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {/* Địa chỉ: Tỉnh/Thành phố, Huyện/Quận, Xã/Phường */}
            <Col xs={24} sm={8}>
              <Form.Item
                label="Tỉnh/Thành phố"
                name="province"
                rules={[
                  { required: true, message: "Vui lòng chọn tỉnh/thành phố!" },
                ]}
              >
                <SelectSearchOptionLabel
                  value={selectedProvinceCode}
                  style={{ width: "100%" }}
                  placeholder="Tỉnh / Thành phố"
                  data={provincesData?.dataOptionProvinces}
                  isLoading={provincesData?.isLoading}
                  onChange={onChangeSelectedProvince}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Huyện/Quận"
                name="district"
                rules={[
                  { required: true, message: "Vui lòng chọn huyện/quận!" },
                ]}
              >
                <SelectSearchOptionLabel
                  value={selectedDistrictCode}
                  placeholder="Quận / Huyện"
                  style={{ width: "100%" }}
                  data={districtsData?.dataOptionDistricts}
                  isLoading={districtsData?.isLoading}
                  onChange={onChangeSelectedDistrict}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Xã/Phường"
                name="ward"
                rules={[
                  { required: true, message: "Vui lòng chọn xã/phường!" },
                ]}
              >
                <SelectSearchOptionLabel
                  value={selectedWardCode}
                  placeholder="Phường / Xã"
                  style={{ width: "100%" }}
                  data={wardsData?.dataOptionWards}
                  isLoading={wardsData?.isLoading}
                  onChange={onChangeSelectedWard}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default memo(AddCustomer);
