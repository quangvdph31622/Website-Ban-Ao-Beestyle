"use client";

import React, { useState } from "react";
import ImageUpload from "@/components/Upload/ImageUpload";
import TestPDFComponent from "@/components/User/Invoice/InvoiceComponent";

export default function UploadImg() {
    const formatDate = (date: Date) => {
        return date.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const [invoiceData, setInvoiceData] = useState({
        customerName: "Nguyễn Văn A",
        products: [
            { productId: "P001", productName: "Sản phẩm A", quantity: 2, price: 100000 },
            { productId: "P002", productName: "Sản phẩm B", quantity: 1, price: 150000 },
        ],
        totalAmount: 350000,
        orderDate: formatDate(new Date())
    });

    return (
        <div className="d-flex justify-content-center p-5">
            <ImageUpload />
            {/* <TestPDFComponent invoiceData={invoiceData} /> */}
        </div>
    );
}
