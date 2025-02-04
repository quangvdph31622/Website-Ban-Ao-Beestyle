import useAppNotifications from "@/hooks/useAppNotifications";
import {Button, Col, Form, Modal, Row, Select, Space} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import useAddress from "./hook/useAddress";
import {
    getAddress,
    updateAddress,
    URL_API_ADDRESS,
} from "@/services/AddressService";
import TextArea from "antd/es/input/TextArea";
import SelectSearchOptionLabel from "@/components/Select/SelectSearchOptionLabel";
import useSWR from "swr";


interface IProps {
    mutate: () => Promise<void>;
    initialValues: any | null;
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (value: boolean) => void;
}

const UpdateAddress = (props: IProps) => {
    const {showNotification} = useAppNotifications();
    const {mutate, initialValues, isUpdateModalOpen, setIsUpdateModalOpen} = props;
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [form] = Form.useForm();

    console.log("record: ", initialValues);

    const {data, error, isLoading, mutate: mutateAddress,
    } = useSWR(`${URL_API_ADDRESS.get}/${initialValues.id}`, getAddress, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const address = data?.data || {};

    const [selectedProvinceCode, setSelectedProvinceCode] = useState<string | undefined>(undefined);
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<string | undefined>(undefined);
    const [selectedWardCode, setSelectedWardsCode] = useState<string | undefined>(undefined);

    const [selectedProvinceName, setSelectedProvinceName] = useState<string | null>(null);
    const [selectedDistrictName, setSelectedDistrictName] = useState<string | null>(null);
    const [selectedWardName, setSelectedWardName] = useState<string | null>(null);
    const [selectedDetailName, setSelectedDetailName] = useState<string | null>(null);

    const {handleGetProvinces, handleGetDistricts, handleGetWards} = useAddress();
    const provincesData = handleGetProvinces();
    const districtsData = handleGetDistricts(selectedProvinceCode);
    const wardsData = handleGetWards(selectedDistrictCode);

    useEffect(() => {
        if (address) {
            form.setFieldsValue({
                province: address.city,
                district: address.district,
                ward: address.commune,
                addressName: address.addressName,
            });

            setSelectedProvinceCode(address.cityCode);
            setSelectedDistrictCode(address.districtCode);
            setSelectedWardsCode(address.communeCode);
            setSelectedProvinceName(address.city);
            setSelectedDistrictName(address.district);
            setSelectedWardName(address.commune);
            setSelectedDetailName(address.addressName);
        }
    }, [address]);

    const onChangeSelectedProvince = useCallback((provinceCode: string) => {
        setSelectedProvinceCode(provinceCode);
        const province = provincesData.dataOptionProvinces.find(
            (prev) => prev.key === provinceCode
        );

        form.setFieldsValue({
            province: province?.label || undefined,
            district: undefined,
            ward: undefined,
            addressName: undefined
        });

        setSelectedProvinceName(province?.label);
        setSelectedDistrictCode(undefined);
        setSelectedWardsCode(undefined);
        setSelectedDistrictName(null);
        setSelectedWardName(null);
    }, []);

    const onChangeSelectedDistrict = useCallback(
        (districtCode: string) => {
            setSelectedDistrictCode(districtCode);
            const district = districtsData.dataOptionDistricts.find(
                (prev) => prev.key === districtCode
            );

            form.setFieldsValue({
                district: district?.label || undefined,
                ward: undefined,
                addressName: undefined
            });

            setSelectedDistrictName(district?.label);
            setSelectedWardsCode(undefined);
            setSelectedWardName(null);
        },
        [districtsData]
    );

    const onChangeSelectedWard = useCallback(
        (wardCode: string) => {
            setSelectedWardsCode(wardCode);
            const ward = wardsData.dataOptionWards.find(
                (prev) => prev.key === wardCode
            );
            form.setFieldsValue({
                ward: ward?.label || undefined,
                addressName: undefined
            });

            setSelectedWardName(ward?.label);
        },
        [wardsData]
    );

    const handleDetailAddressChange = (value: string) => {
        setSelectedDetailName(value);
    };

    const hanldeClose = () => {
        form.resetFields();
        setSelectedProvinceCode(undefined);
        setSelectedDistrictCode(undefined);
        setSelectedWardsCode(undefined);
        setIsUpdateModalOpen(false);
    }

    const onFinish = async (value: any) => {
        try {
            const address = {
                addressName: selectedDetailName,
                cityCode: Number(selectedProvinceCode),
                city: selectedProvinceName,
                districtCode: Number(selectedDistrictCode),
                district: selectedDistrictName,
                communeCode: Number(selectedWardCode),
                commune: selectedWardName,
                isDefault: initialValues.isDefault,
                ...value,
            };

            if (initialValues) {
                const data = {...address, id: initialValues.id};
                const result = await updateAddress(data);
                mutate();
                if (result.data) {
                    form.resetFields();
                    hanldeClose();
                    showNotification("success", {message: result.message});
                }
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            if (errorMessage && typeof errorMessage === "object") {
                Object.entries(errorMessage).forEach(([field, message]) => {
                    showNotification("error", {message: String(message)});
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
                title="Cập nhật địa chỉ"
                // cancelText="Hủy"
                // okText="Lưu"
                footer=""
                width={650}
                style={{top: 20}}
                open={isUpdateModalOpen}
                onOk={() => form.submit()}
                onCancel={() => hanldeClose()}
                // okButtonProps={{ style: { background: "#00b96b" } }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onValuesChange={() => setIsFormChanged(true)} // Mở nút cập nhật khi có thay đổi
                >
                    <Row gutter={16}>
                        {" "}
                        {/* Thêm khoảng cách giữa các cột */}
                        <Col span={8}>
                            {" "}
                            {/* Mỗi cột chiếm 1/3 chiều rộng */}
                            <Form.Item
                                label="Tỉnh/Thành phố"
                                name="province"
                                rules={[
                                    {required: true, message: "Vui lòng chọn tỉnh/thành phố!"},
                                ]}
                            >
                                <SelectSearchOptionLabel
                                    value={selectedProvinceCode}
                                    style={{width: "100%"}}
                                    placeholder="Tỉnh / Thành phố"
                                    data={provincesData?.dataOptionProvinces}
                                    isLoading={provincesData?.isLoading}
                                    onChange={onChangeSelectedProvince}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Huyện/Quận"
                                name="district"
                                rules={[
                                    {required: true, message: "Vui lòng chọn huyện/quận!"},
                                ]}
                            >
                                <SelectSearchOptionLabel
                                    value={selectedDistrictCode}
                                    placeholder="Quận / Huyện"
                                    style={{width: "100%"}}
                                    data={districtsData?.dataOptionDistricts}
                                    isLoading={districtsData?.isLoading}
                                    onChange={onChangeSelectedDistrict}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Xã/Phường"
                                name="ward"
                                rules={[
                                    {required: true, message: "Vui lòng chọn xã/phường!"},
                                ]}
                            >
                                <SelectSearchOptionLabel
                                    value={selectedWardCode}
                                    placeholder="Phường / Xã"
                                    style={{width: "100%"}}
                                    data={wardsData?.dataOptionWards}
                                    isLoading={wardsData?.isLoading}
                                    onChange={onChangeSelectedWard}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Chi tiết" name="addressName">
                        <TextArea
                            onChange={(e) => handleDetailAddressChange(e.target.value)}
                            placeholder="Nhập địa chỉ chi tiết"
                        />
                    </Form.Item>
                    <Space className="flex justify-center">
                        <Button type="primary" htmlType="submit" disabled={!isFormChanged}>
                            Cập nhật
                        </Button>
                    </Space>
                </Form>
            </Modal>
        </>
    );
};
export default UpdateAddress;
