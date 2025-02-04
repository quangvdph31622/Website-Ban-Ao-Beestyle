export const ORDER_STATUS = {
        PENDING: {
        id: 0,
        key: "PENDING",
        description: "Chờ thanh toán",
        color_tag: "#FFA500"
    },
    PAID: {
        id: 1,
        key: "PAID",
        description: "Đã thanh toán",
        color_tag: "#3CB371"
    },
    AWAITING_CONFIRMATION: {
        id: 2,
        key: "AWAITING_CONFIRMATION",
        description: "Chờ xác nhận",
        color_tag: "#FFA500",
    },
    CONFIRMED: {
        id: 3,
        key: "CONFIRMED",
        description: "Đã xác nhận",
        color_tag: "#1E90FF",
    },
    AWAITING_SHIPMENT: {
        id: 4,
        key: "AWAITING_SHIPMENT",
        description: "Chờ giao hàng",
        color_tag: "#9370DB",
    },
    OUT_FOR_DELIVERY: {
        id: 5,
        key: "OUT_FOR_DELIVERY",
        description: "Đang giao hàng",
        color_tag: "#87CEEB",
    },
    DELIVERED: {
        id: 6,
        key: "DELIVERED",
        description: "Đã giao hàng",
        color_tag: "#3CB371",
    },
    CANCELLED: {
        id: 7,
        key: "CANCELLED",
        description: "Đã hủy",
        color_tag: "#f50"
    },
    RETURNED: {
        id: 8,
        key: "RETURNED",
        description: "Đã trả hàng",
        color_tag: "#f50"
    },
    // RETURN_REQUESTED: "Yêu cầu trả hàng",
    // RETURNED: "Đã trả hàng",
    // REFUNDED: "Đã hoàn tiền"
} as const;
