import React, { useCallback, useEffect, useState } from "react";
import { Input, Checkbox, Button, Form } from "antd";
import {
  EditOutlined,
  CloseOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import useAppNotifications from "@/hooks/useAppNotifications";
import useSWR from "swr";
import {
  createAddress,
  deleteAddress,
  getAddressByCustomerId,
  setIsDefault,
  updateAddress,
  URL_API_ADDRESS,
} from "@/services/AddressService";
import { IAddress } from "@/types/IAddress";
import { formatAddress } from "@/utils/AppUtil";
import SelectSearchOptionLabel from "@/components/Select/SelectSearchOptionLabel";
import TextArea from "antd/es/input/TextArea";
import useAddress from "@/components/Admin/Address/hook/useAddress";

interface IProps {
  idCustomer: any;
}

const AddressCard = (props: IProps) => {
  const { idCustomer } = props;
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [addressUpdate, setAddressUpdate] = useState<any>();
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(-1);
  const { showModal, showNotification } = useAppNotifications();
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string | undefined>("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string | undefined>("");
  const [selectedWardCode, setSelectedWardsCode] = useState<string | null>(null);
  const [selectedProvinceName, setSelectedProvinceName] = useState<string | null>(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState<string | null>(null);
  const [selectedWardName, setSelectedWardName] = useState<string | null>(null);
  const [detailAddress, setDetailAddress] = useState<string | null>(null);

  const { handleGetProvinces, handleGetDistricts, handleGetWards } =
    useAddress();
  const provincesData = handleGetProvinces();
  const districtsData = handleGetDistricts(selectedProvinceCode);
  const wardsData = handleGetWards(selectedDistrictCode);

  const { data, error, mutate } = useSWR(
    `${URL_API_ADDRESS.get}?id=${idCustomer}`,
    getAddressByCustomerId,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const addresses = data?.data?.items || [];
  console.log(addresses);
  
  useEffect(() => {
    if (error) {
      showNotification("error", {
        message: error?.message,
        description:
          error?.response?.data?.message || "Error fetching addresses",
      });
    }
  }, [error]);

  // console.log(addresses);

  //   Phần thêm địa chỉ

  const onChangeSelectedProvince = useCallback((provinceCode: string) => {
      setSelectedProvinceCode(provinceCode);
      const province = provincesData.dataOptionProvinces.find(
        (prev) => prev.key === provinceCode
      );
      setSelectedProvinceCode(provinceCode);
      form.setFieldsValue({
        province: provinceCode, // Cập nhật tỉnh
        district: undefined, // Reset huyện
        ward: undefined, // Reset xã
        detail:undefined
      });
      formUpdate.setFieldsValue({
        province: provinceCode, // Cập nhật tỉnh
        districtName: undefined, // Reset huyện
        ward: undefined, // Reset xã
        detail:undefined
      });

      setSelectedProvinceName(province?.label);
      setSelectedDistrictCode("");
      setSelectedWardsCode(null);
      setSelectedDistrictName(null);
      setSelectedWardName(null);
      setDetailAddress(null)
      // console.log(provinceCode);
    },
    [provincesData]
  );

  const onChangeSelectedDistrict = useCallback((districtCode: string) => {
      setSelectedDistrictCode(districtCode);
      const district = districtsData.dataOptionDistricts.find(
        (prev) => prev.key === districtCode
      );
      form.setFieldsValue({
        district: districtCode, // Cập nhật huyện trong Form
        ward: undefined, // Reset xã
        detail:undefined
      });
      formUpdate.setFieldsValue({
        districtName: districtCode, // Cập nhật huyện trong Form
        ward: undefined, // Reset xã
        detail:undefined
      });
      setSelectedDistrictName(district?.label);
      // console.log(selectedDistrictName);
      

      setSelectedWardsCode(null);
      setSelectedWardName(null);
      setDetailAddress(null)
      // console.log(districtCode);
    },
    [districtsData]
  );

  const onChangeSelectedWard = useCallback((wardCode: string) => {
      setSelectedWardsCode(wardCode);
      const ward = wardsData.dataOptionWards.find(
        (prev) => prev.key === wardCode
      );
      form.setFieldsValue({
        detail:undefined
      });
      formUpdate.setFieldsValue({
        detail:undefined
      });
      setSelectedWardName(ward?.label);
      setDetailAddress(null)
      // console.log(selectedWardName);
      // console.log(wardCode);
    },
    [wardsData]
  );

  // Xử lý khi số nhà được chọn
  const handleDetailAddressChange = (value: string) => {
    setDetailAddress(value);
  };

//   Checkbox mặc định
  const isDefault = async (value: any, address: any, mutate: any) => {
    if (value.default) {
      try {
        const data = {
          ...address,
          isDefault: true,
          id: address.id,
        };
        const result = await setIsDefault(data);
        await mutate();
        if (result.data) {
          //   showNotification("success", { message: result.message });
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message;
        if (errorMessage && typeof errorMessage === "object") {
          Object.entries(errorMessage).forEach(([field, message]) => {
            showNotification("error", { message: String(message) });
          });
        } else {
          showNotification("error", {
            message: error?.message,
            description: errorMessage,
          });
        }
      }
    }
  };

//  form cập nhật 

  const updateForm = async (value: any) => {
    // console.log("Value", value);
    // console.log(addressUpdate);
    // console.log(selectedDistrictName);
    try {
      const address = {
        addressName: detailAddress,
        cityCode: Number(selectedProvinceCode),
        city: selectedProvinceName,
        districtCode: Number(selectedDistrictCode),
        district: selectedDistrictName,
        communeCode: Number(selectedWardCode),
        commune: selectedWardName,
        isDefault: addressUpdate.isDefault,
        ...value,
      };
    
      
      // console.log(address);

      if (addressUpdate) {
        const data = { ...address, id: addressUpdate.id };
        // console.log("data: ", data);
        const result = await updateAddress(data);
        isDefault(value, addressUpdate, mutate);
        mutate();
        if (result.data) {
          formUpdate.resetFields();
          setIsEditing(false);
          setAddressUpdate(null);
          handleClearAddress()
          showNotification("success", { message: result.message });
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
          message: error?.message,
          description: errorMessage,
        });
      }
    }
  };

//   Form thêm địa chỉ
  const onFinish = async (value: any) => {
    const address = {
      addressName: detailAddress,
      cityCode: Number(selectedProvinceCode), 
      city: selectedProvinceName, 
      districtCode: Number(selectedDistrictCode), 
      district: selectedDistrictName, 
      communeCode: Number(selectedWardCode), 
      commune: selectedWardName, 
      isDefault: false,
      customerId: idCustomer, 
    };
    console.log("Success:", address);
    try {
      const result = await createAddress(address);
      if (result.data) {
        const address = result.data;
        isDefault(value, address, mutate);
        setShowNewAddressForm(false);
        form.resetFields();
        handleClearAddress()
        showNotification("success", {
          message: "Thêm địa chỉ thành công",
          description: result.message,
        });
      }
      mutate();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage && typeof errorMessage === "object") {
        Object.entries(errorMessage).forEach(([field, message]) => {
          showNotification("error", { message: String(message) });
        });
      } else {
        showNotification("error", {
          message: "Thêm địa chỉ thất bại",
          description: errorMessage,
        });
      }
    }
  };

  const handleClearAddress = () => {
    form.resetFields();
    formUpdate.resetFields();
    setSelectedProvinceCode("");
    setSelectedDistrictCode("");
    setSelectedWardsCode(null);
    setDetailAddress("")
  };


  const toggleEditing = (index: number, address: any) => {
    if (index === editingAddressIndex) {
      setIsEditing(true);
      handleClearAddress();
    }
    // console.log(address);
    setAddressUpdate(address);

    if (address) {
      formUpdate.setFieldsValue({
        province: address.city,
        districtName: address.district,
        ward: address.commune,
        detail: address.addressName,
      });
      setSelectedProvinceCode(address.cityCode);
      setSelectedDistrictCode(address.districtCode);
      setSelectedWardsCode(address.communeCode);
      setSelectedProvinceName(address.city);
      setSelectedDistrictName(address.district);
      setSelectedWardName(address.commune);
      setDetailAddress(address.addressName);
    }
    setEditingAddressIndex(index);
  };

  const handleCancel = () => {
    handleClearAddress()
    setShowNewAddressForm(false);
  };

  const handleNewAddressClick = () => {
    setShowNewAddressForm(true);
  };

  // Xoá địa chỉ theo id hoặc index
  const handleAddressRemove = (address: any) => {
    showModal("confirm", {
      title: "Xoá địa chỉ",
      content: "Bạn có chắc chắn muốn xóa địa chỉ này?",
      icon: <QuestionCircleOutlined style={{ color: "red" }} />,
      centered: true,
      okText: "Xoá",
      cancelText: "Không",
      onOk: async () => {
        try {
          const result = await deleteAddress(address);
          // console.log(result);

          if (result.code == 200) {
            mutate();
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
              message: error?.message,
              description: errorMessage,
            });
          }
        }
      },
    });
  };

  return (
    <>
      <div className="flex mt-4">
        {/* Form sửa địa chỉ */}
        <div className="w-[50%] me-4">
          {addresses.map((address: IAddress, index: number) => (
            <div key={index} className="mb-4">
              <div
                className="flex justify-between font-bold"
                style={{ backgroundColor: "#D9EDF7", padding: "9px 10px" }}
              >
                {`#${index+1}`}
                {address.isDefault ? " (Địa chỉ mặc định)" : ""}
                <div className="space-x-4">
                  <EditOutlined
                    onClick={() => {toggleEditing(index, address)}}
                    className="cursor-pointer text-blue-500"
                  />
                  <CloseOutlined
                    onClick={() => handleAddressRemove(address)}
                    className="cursor-pointer text-red-500"
                  />
                </div>
              </div>

              {/* Cập nhật địa chỉ */}
              {isEditing && editingAddressIndex === index && (
                <Form
                  className="mt-6"
                  form={formUpdate}
                  onFinish={updateForm}
                  layout="horizontal"
                  labelAlign="left"
                  labelWrap
                  labelCol={{ span: 1 }}
                  wrapperCol={{ span: 25 }}
                >
                  <Form.Item
                    // label="Tỉnh/Thành phố"
                    name="province"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn tỉnh/thành phố!",
                      },
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

                  <Form.Item
                    // label="Huyện/Quận"
                    name="districtName"
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

                  <Form.Item
                    // label="Xã/Phường"
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

                  <Form.Item
                    // label="Chi tiết"
                    name="detail"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập địa chỉ chi tiết!",
                      },
                    ]}
                  >
                    <TextArea
                      onChange={(e) =>
                        handleDetailAddressChange(e.target.value)
                      }
                      placeholder="Nhập địa chỉ chi tiết"
                    />
                  </Form.Item>

                  <Form.Item
                    name="default" // Đây là tên trường trong value của form
                    valuePropName="checked" // Chỉ định rằng giá trị sẽ là trạng thái checked của Checkbox
                  >
                    <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
                  </Form.Item>
                  <div className="flex justify-between">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-black border-0 rounded-0 px-3 py-2 text-white fw-semibold uppercase"
                    >
                      Cập nhật
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        setIsEditing(false);
                        handleClearAddress();
                      }}
                      className="bg-gray-3 hover:!bg-slate-100 border-0 rounded-0 px-3 py-2 text-black fw-semibold uppercase"
                    >
                      hoặc Hủy
                    </Button>
                  </div>
                </Form>
              )}

              {(!isEditing || editingAddressIndex !== index) && (
                <div className="p-4" style={{ backgroundColor: "#FBFBFB" }}>
                  <p>Địa chỉ: {formatAddress(address)}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form thêm mới địa chỉ */}
        <div className="w-[50%]">
          <Button
            className="w-full border-0 rounded-none text-white fw-semibold uppercase"
            style={{ backgroundColor: "#323232", padding: "20px 0" }}
            onClick={handleNewAddressClick}
          >
            Nhập địa chỉ mới
          </Button>
          {showNewAddressForm && (
            <Form
              className="mt-6"
              form={form}
              onFinish={onFinish}
              layout="horizontal"
              labelAlign="left"
              labelWrap
              labelCol={{ span: 1 }}
              wrapperCol={{ span: 25 }}
            >
              <Form.Item
                // label="Tỉnh/Thành phố"
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

              <Form.Item
                // label="Huyện/Quận"
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

              <Form.Item
                // label="Xã/Phường"
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

              <Form.Item
                // label="Chi tiết"
                name="detail"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ chi tiết!",
                  },
                ]}
              >
                <TextArea
                  onChange={(e) => handleDetailAddressChange(e.target.value)}
                  placeholder="Nhập địa chỉ chi tiết"
                />
              </Form.Item>
              <Form.Item
                name="default" // Đây là tên trường trong value của form
                valuePropName="checked" // Chỉ định rằng giá trị sẽ là trạng thái checked của Checkbox
              >
                <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
              </Form.Item>
              <div className="flex justify-between">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-black border-0 rounded-0 px-3 py-2 text-white fw-semibold uppercase"
                >
                  Thêm mới
                </Button>
                <Button
                  type="primary"
                  onClick={handleCancel}
                  className="bg-gray-3 hover:!bg-slate-100 border-0 rounded-0 px-3 py-2 text-black fw-semibold uppercase"
                >
                  hoặc Hủy
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </>
  );
};

export default AddressCard;
