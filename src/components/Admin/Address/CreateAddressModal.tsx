import {Form, Modal, Select, Spin} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import useAddress from "./hook/useAddress";
import {IAddress} from "@/types/IAddress";
import {createAddress} from "@/services/AddressService";
import useAppNotifications from "@/hooks/useAppNotifications";
import {useParams} from "next/navigation";
import TextArea from "antd/es/input/TextArea";
import SelectSearchOptionLabel from "@/components/Select/SelectSearchOptionLabel";

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (value: boolean) => void;
    mutate: any;
}

const CreateAddressModal = (props: IProps) => {
    const {isCreateModalOpen, setIsCreateModalOpen, mutate} = props;
    const [selectedProvinceCode, setSelectedProvinceCode] = useState<string | null>(null);
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<string | null>(null);
    const [selectedWardCode, setSelectedWardsCode] = useState<string | null>(null);

    const [selectedProvinceName, setSelectedProvinceName] = useState<string | null>(null);
    const [selectedDistrictName, setSelectedDistrictName] = useState<string | null>(null);
    const [selectedWardName, setSelectedWardName] = useState<string | null>(null);
    const [detailAddress, setDetailAddress] = useState<string | null>(null);

    const {handleGetProvinces, handleGetDistricts, handleGetWards} = useAddress();
    const provincesData = handleGetProvinces();
    const districtsData = handleGetDistricts(selectedProvinceCode);
    const wardsData = handleGetWards(selectedDistrictCode);

    const {id} = useParams();
    console.log(id);

    const {showNotification} = useAppNotifications();
    const [form] = Form.useForm();


    const handleCancelModal = () => {
        form.resetFields();
        setSelectedProvinceCode(null);
        setSelectedDistrictCode(null);
        setSelectedWardsCode(null);
        setIsCreateModalOpen(false);
    };


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

    // Xử lý khi số nhà được chọn
    const handleDetailAddressChange = (value: string) => {
        setDetailAddress(value);
    };
    const onFinish = async (value: IAddress) => {

        const address = {
            addressName: detailAddress,
            cityCode: Number(selectedProvinceCode), // Nếu cần chuyển đổi
            city: selectedProvinceName, // Lưu tên tỉnh vào đây
            districtCode: Number(selectedDistrictCode), // Nếu cần chuyển đổi
            district: selectedDistrictName, // Lưu tên huyện vào đây
            communeCode: Number(selectedWardCode), // Cần lấy từ API nếu có
            commune: selectedWardName, // Tên xã
            isDefault: false,
            customerId:id
        };
        console.log("Success:", address);
        try {
            const result = await createAddress(address);
            if (result.data) {
                handleCancelModal();
                showNotification("success", {message: result.message});
            }
            mutate();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage && typeof errorMessage === "object") {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", {message: String(message)});
                });
            } else {
                showNotification("error", {
                    message: "Thêm địa chỉ thất bại",
                    description: errorMessage,
                });
            }
        }
    };

    return (
        <Modal
            title="Thêm địa chỉ"
            cancelText="Hủy"
            okText="Lưu"
            width={600}
            style={{top: 20}}
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCancelModal()}
            okButtonProps={{style: {background: "#00b96b"}}}
        >
            <Form
                form={form}
                onFinish={onFinish}
                layout="horizontal"
                labelAlign="left"
                labelWrap
                labelCol={{span: 6}}
                wrapperCol={{span: 20}}
            >
                <Form.Item label="Tỉnh/Thành phố" name="province"
                           rules={[{required: true, message: "Vui lòng chọn tỉnh/thành phố!"}]}>
                    <SelectSearchOptionLabel

                        value={selectedProvinceCode}
                        style={{width: "100%"}}
                        placeholder="Tỉnh / Thành phố"
                        data={provincesData?.dataOptionProvinces}
                        isLoading={provincesData?.isLoading}
                        onChange={onChangeSelectedProvince}
                    />
                </Form.Item>

                <Form.Item label="Huyện/Quận" name="district"
                           rules={[{required: true, message: "Vui lòng chọn huyện/quận!"}]}>
                    <SelectSearchOptionLabel
                        value={selectedDistrictCode}
                        placeholder="Quận / Huyện"
                        style={{width: "100%"}}
                        data={districtsData?.dataOptionDistricts}
                        isLoading={districtsData?.isLoading}
                        onChange={onChangeSelectedDistrict}
                    />
                </Form.Item>

                <Form.Item label="Xã/Phường" name="ward"
                           rules={[{required: true, message: "Vui lòng chọn xã/phường!"}]}>
                    <SelectSearchOptionLabel
                        value={selectedWardCode}
                        placeholder="Phường / Xã"
                        style={{width: "100%"}}
                        data={wardsData?.dataOptionWards}
                        isLoading={wardsData?.isLoading}
                        onChange={onChangeSelectedWard}
                    />
                </Form.Item>

                <Form.Item label="Chi tiết" name="detail"
                           rules={[{required: true, message: "Vui lòng nhập địa chỉ chi tiết!"}]}>
                    <TextArea
                        onChange={(e) => handleDetailAddressChange(e.target.value)}
                        placeholder="Nhập địa chỉ chi tiết"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateAddressModal;
