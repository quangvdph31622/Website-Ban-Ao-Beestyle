import React, {useImperativeHandle, forwardRef, useState, useEffect, memo} from "react";
import {previewInvoicePdf} from "@/services/InvoiceService";
import {getSendThankMail} from "@/services/MailService";

interface InvoiceComponentProps {
    id: number | null;
}

const InvoiceComponent = forwardRef(({id}: InvoiceComponentProps, ref) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    // Hàm để tải và hiển thị PDF
    const handlePreviewAndPrint = async () => {
        if (!id) {
            console.error("ID hóa đơn không hợp lệ");
            return;
        }
        try {
            const base64Pdf = await previewInvoicePdf(id);
            if (base64Pdf) {
                const validBase64 = base64Pdf.startsWith("data:application/pdf;base64,")
                    ? base64Pdf
                    : `data:application/pdf;base64,${base64Pdf}`;
                const byteCharacters = atob(validBase64.split(",")[1]);
                const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], {type: "application/pdf"});
                const pdfBlobUrl = URL.createObjectURL(blob);
                setPdfUrl(pdfBlobUrl);

                const fileName = `Invoice_${id || "Unknown"}.pdf`;
                const pdfFile = new File([blob], fileName, {type: "application/pdf"});
                const dataMail = {
                    id: id,
                    files: pdfFile
                };

                console.log(dataMail);
                const mail = await getSendThankMail(dataMail);
                console.log('Mail sent successfully: ', mail);
            } else {
                console.error("Không thể tạo xem trước PDF.");
            }
        } catch (error) {
            console.error("Lỗi khi tạo xem trước PDF:", error);
        }
    };

    // Expose method to parent via ref
    useImperativeHandle(ref, () => ({
        printInvoice: handlePreviewAndPrint,
    }));

    useEffect(() => {
        if (pdfUrl) {
            const iframe = document.getElementById("pdf-iframe") as HTMLIFrameElement;
            if (iframe) {
                iframe.onload = () => {
                    iframe.contentWindow?.print();
                };
            }
        }
    }, [pdfUrl]);

    return (
        <>
            {pdfUrl && (
                <iframe
                    id="pdf-iframe"
                    src={pdfUrl}
                    style={{display: "none"}}
                    title="Hóa Đơn"
                />
            )}
        </>
    );
});


export default memo(InvoiceComponent);


