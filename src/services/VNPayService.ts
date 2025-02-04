import { IOrderOnlineCreateOrUpdate } from "@/types/IOrder";
import httpInstance from "@/utils/HttpInstance";

export const URL_API_VNPAY = {
    createPayment: "/payment/create-payment", // Tạo liên kết thanh toán
    verifyPayment: "/payment/verify-payment", // Xác minh kết quả thanh toán
    paymentSuccess: "/payment/success", // Hoàn tất thanh toán VNPay
};

/**
 * Gửi yêu cầu tạo liên kết thanh toán VNPay
 * @param orderId Mã đơn hàng (duy nhất)
 * @param amount Số tiền cần thanh toán (đơn vị: VNĐ)
 * @param ipAddress Địa chỉ IP của người dùng
 * @param bankCode Mã ngân hàng (nếu có)
 * @returns URL để redirect tới VNPay
 */
// Hàm createVNPayPayment đã được cập nhật ở phía trước

export const createVNPayPayment = async (
    orderId: string,
    amount: number,
    ipAddress: string,
    bankCode?: string,
) => {
    try {
        const response = await httpInstance.post(URL_API_VNPAY.createPayment, {
            orderId,
            amount,
            ipAddress,
            bankCode,
        });
        console.log("Dữ liệu trả về từ backend:", response.data);
        return response.data; // Kiểm tra dữ liệu trả về có chính xác không
    } catch (error) {
        console.error("Lỗi khi tạo thanh toán VNPay:", error);
        throw error; // Ném lỗi ra để xử lý ở tầng gọi
    }
};


/**
 * Xác minh kết quả thanh toán từ VNPay
 * @param queryParams Tham số query từ URL callback của VNPay
 * @returns Trạng thái giao dịch và thông tin chi tiết
 */
export const verifyVNPayPayment = async (queryParams: Record<string, string>) => {
    try {
        const response = await httpInstance.get(URL_API_VNPAY.verifyPayment, {
            params: queryParams,
        });
        return response.data; // Trả về kết quả xác minh giao dịch
    } catch (error) {
        console.error("Lỗi khi xác minh thanh toán VNPay:", error);
        throw error; // Ném lỗi ra để xử lý ở tầng gọi
    }
};
