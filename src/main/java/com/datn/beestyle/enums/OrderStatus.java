package com.datn.beestyle.enums;

public enum OrderStatus {

    PENDING, // chờ thanh toán
    PAID, // đã thanh toán
    AWAITING_CONFIRMATION, // chờ xác nhận
    CONFIRMED, // đã xác nhận
    OUT_FOR_DELIVERY, // đang giao hàng
    DELIVERED, // đã giao hàng
    CANCELLED, // đã hủy
    RETURN_REQUESTED, // yêu cầu trả hàng
    RETURNED, // đã trả hàng
    REFUNDED // đã hoàn tiền
}
