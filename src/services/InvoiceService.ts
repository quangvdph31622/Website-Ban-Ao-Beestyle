import httpInstance from "@/utils/HttpInstance";
import axios from 'axios';

export const URL_API_INVOICE = {
  generatePdf: '/invoice',
  previewPdf: "/preview",
};



// Hàm để tải file PDF của hóa đơn
export const downloadInvoicePdf = async (invoiceId) => {
    try {
        // Gửi yêu cầu GET để tải file PDF
        const response = await axios.get(`http://localhost:8080/api/v1/invoice/${invoiceId}`, {
            responseType: 'blob', // Đảm bảo phản hồi trả về dưới dạng blob
        });


        // Tạo URL từ blob data
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Tạo một thẻ a để tải file xuống
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${invoiceId}.pdf`); // Đặt tên file khi tải xuống

        // Thêm link vào body và click để tải file
        document.body.appendChild(link);
        link.click();

        // Xóa link sau khi tải xong
        document.body.removeChild(link);
    } catch (error) {
        console.error('Lỗi khi tải hóa đơn:', error);
    }
};
  export const previewInvoicePdf = async (invoiceId: any): Promise<string | null> => {
    try {
      const response = await httpInstance.get(`${URL_API_INVOICE.previewPdf}/${invoiceId}`, {
        responseType: "arraybuffer", // Nhận dữ liệu PDF từ backend
      });

      // Chuyển đổi sang Base64
      const base64Pdf = `data:application/pdf;base64,${btoa(
        new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), "")
      )}`;

      return base64Pdf; // Trả về chuỗi Base64
    } catch (error) {
      console.error("Lỗi khi lấy preview PDF:", error);
      return null;
    }
  };
