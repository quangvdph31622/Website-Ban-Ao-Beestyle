import { Button, Card, Form, FormInstance } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { checkShoppingCartData, ICartItem } from "@/services/user/ShoppingCartService";
import useAppNotifications from "@/hooks/useAppNotifications";
import { RiDiscountPercentLine } from "react-icons/ri";
import DiscountCodeModal from "../Discount/DiscountCodeModal";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { PAYMENT_METHOD } from "@/constants/PaymentMethod";
import { IVoucherUser } from "@/types/IVoucher";
import { MdOutlineDiscount } from "react-icons/md";
import { calculateInvoiceDiscount, calculateShippingFee, calculateUserCartTotalAmount, calculateUserCartTotalAmountWithVoucherAndShippingFee, getAccountInfo } from "@/utils/AppUtil";
import { IAddress } from "@/types/IAddress";

interface IProps {
    handleSubmit: (payment: any) => Promise<void>;
    shippingAddress: IAddress | undefined;
    selectedPayment: string;
    userForm: FormInstance;
    cartsProp: ICartItem[];
}

const OrderDetail = (props: IProps) => {
    const {
        handleSubmit,
        shippingAddress,
        selectedPayment,
        userForm,
        cartsProp,
    } = props;
    const router = useRouter();
    const { showModal } = useAppNotifications();
    const { showNotification } = useAppNotifications();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cartItems, setCartItems] = useState(cartsProp);
    const [appliedVoucher, setAppliedVoucher] = useState<IVoucherUser | null>(null);
    const [shippingFee, setShippingFee] = useState<number>(0);

    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);


    // Kiểm tra giỏ hàng rỗng khi render component
    useEffect(() => {
        const handleStorageChange = () => {
            const updatedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
            setCartItems(updatedCart);
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const originalAmount = calculateUserCartTotalAmount(cartItems); // Tính tổng giá của toàn bộ sản phẩm trong giỏ
    const shippingFeePromise = calculateShippingFee(originalAmount, shippingAddress);

    shippingFeePromise
        .then((shippingFee) => {
            setShippingFee(shippingFee);
        })
        .catch((error) => {
            console.error("Lỗi khi tính phí ship:", error);
        });
    const discountAmount = calculateInvoiceDiscount(appliedVoucher, originalAmount);
    const totalAmount = calculateUserCartTotalAmountWithVoucherAndShippingFee(originalAmount, discountAmount, shippingFee); // Tính tổng giá của toàn bộ sản phẩm trong giỏ (Đã tính phí ship + voucher)
    const voucherId = appliedVoucher?.id;

    const onButtonClick = async () => {
        if (!getAccountInfo()) {
            await checkShoppingCartData();
        }

        if (!selectedPayment) {
            // Check xem có method thanh toán nào được chọn chưa
            showNotification("error", { message: "Vui lòng chọn phương thức thanh toán!" });
            return;
        } else {
            // Check giỏ hàng rỗng khi click thanh toán
            if (cartItems.length === 0) {
                router.push('/cart');
                return;
            } else {
                try {
                    // Validate form
                    await userForm.validateFields();

                    const data = {
                        originalAmount,
                        discountAmount,
                        totalAmount,
                        shippingFee,
                        selectedPayment,
                        voucherId
                    }

                    // Confirm thanh toán (Modal confirm chỉ áp dụng đối với COD)
                    if (selectedPayment === PAYMENT_METHOD.CASH_AND_BANK_TRANSFER.key) {
                        showModal('confirm', {
                            title: 'Xác nhận đặt hàng',
                            content: 'Bạn có muốn xác nhận đơn hàng này?',
                            icon: (<QuestionCircleOutlined style={{ color: 'blue' }} />),
                            centered: true,
                            okText: 'Xác nhận',
                            cancelText: 'Huỷ bỏ',
                            onOk: async () => {
                                await handleSubmit({ ...data });
                            }
                        });
                    } else if (selectedPayment === PAYMENT_METHOD.BANK_TRANSFER.key) {
                        await handleSubmit({ ...data });
                    } else {
                        console.warn("Phương thức thanh toán không tồn tại!");
                    }
                } catch (errorInfo) {
                    // Xử lý lỗi nếu quá trình confirm thanh toán có vấn đề
                    console.error('Đã xảy ra lỗi khi đặt hàng:', errorInfo);
                }
            }
        }
    };

    return (
        <>
            <div className="p-5 bg-white rounded-lg shadow-md">
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
                </div>

                <div className="space-y-2 text-sm pb-2 border-b">
                    <div className="flex justify-between">
                        <span>Tổng giá trị sản phẩm</span>
                        <span>{originalAmount.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Phí vận chuyển</span>
                        <span>{shippingFee.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                        <span>Giảm giá vận chuyển</span>
                        <span>
                            {originalAmount >= 500000 && shippingFee > 0 ? "-" + shippingFee.toLocaleString() : "0"} đ
                        </span>
                    </div>
                    <div className="flex justify-between text-red-500">
                        <span>Giảm giá voucher</span>
                        <span>
                            {discountAmount > 0 ? "-" + discountAmount.toLocaleString() : "0"} đ
                        </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Tổng thanh toán</span>
                        <span>{totalAmount.toLocaleString()} đ</span>
                    </div>
                    {getAccountInfo() && (
                        <div className="bg-blue-50 p-1 rounded-lg mb-4 mt-4 flex justify-between items-center">
                            <p className="font-medium mt-3 ms-3 flex items-center">
                                <RiDiscountPercentLine size={20} className="me-1" /> Mã giảm giá
                            </p>
                            <Button
                                type="link"
                                className="text-blue-500"
                                onClick={openModal}
                            >
                                Chọn mã {">"}
                            </Button>
                        </div>
                    )}

                    {/* Hiển thị voucher được chọn */}
                    {appliedVoucher && getAccountInfo() ? (
                        <Card
                            key={appliedVoucher.id}
                            className={"relative rounded-md overflow-hidden flex flex-col mb-3"}
                            style={{ border: '1px solid #f0f0f0' }}
                            styles={{ body: { padding: 10 } }}
                        >
                            <div className="absolute top-0 left-0 w-2 bg-yellow-400 h-full"></div>

                            <div className="flex items-center">
                                <MdOutlineDiscount size={40} className="mx-3" />
                                <div
                                    className="absolute ms-1 top-0 left-20 h-full"
                                    style={{
                                        borderRight: '1px dashed #DADADA'
                                    }}
                                ></div>
                                <div className="ms-4">
                                    <div className="font-bold text-base text-black truncate">{appliedVoucher.voucherCode}</div>
                                    <div className="text-sm font-semibold text-black mb-1">
                                        {appliedVoucher.voucherName}
                                    </div>
                                    <div className="text-xs text-gray-600 truncate">
                                        {appliedVoucher.discountType === 'PERCENTAGE' ?
                                            `Giảm giá ${appliedVoucher.discountValue}% (tối đa ${appliedVoucher.maxDiscount.toLocaleString()}đ)` :
                                            appliedVoucher.discountType === 'CASH' ? `Giảm giá ${appliedVoucher.discountValue.toLocaleString()}đ` : ''
                                        }
                                    </div>
                                </div>
                            </div>

                            <button
                                className="absolute top-2 right-2 bg-black text-white px-2 rounded-md border-none"
                                onClick={() => setAppliedVoucher(null)}
                            >
                                X
                            </button>
                        </Card>
                    ) : ('')}
                </div>

                <div className="mt-6">
                    <h3 className="mb-3"></h3>
                </div>

                <div className="mt-6 text-center">
                    <Form.Item>
                        <Button
                            type="primary"
                            size="large"
                            className="w-full bg-black hover:!bg-orange-400"
                            onClick={onButtonClick}
                        >
                            THANH TOÁN NGAY
                        </Button>
                    </Form.Item>
                </div>
            </div>

            {/* Voucher modal */}
            {isModalVisible && (
                <DiscountCodeModal
                    isVisible={isModalVisible}
                    onClose={closeModal}
                    onApply={(voucher) => {
                        setAppliedVoucher(voucher);
                        closeModal();
                    }}
                />
            )}
        </>
    );
};

export default OrderDetail;
