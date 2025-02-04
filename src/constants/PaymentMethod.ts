export const PAYMENT_METHOD = {
    CASH: {
        id: 0,
        key: "CASH",
        description: "Tiền mặt",
    },
    BANK_TRANSFER: {
        id: 1,
        key: "BANK_TRANSFER",
        description: "Chuyển khoản",
    },
    CASH_AND_BANK_TRANSFER: {
        id: 2,
        key: "CASH_AND_BANK_TRANSFER",
        description: "Tiền mặt và chuyển khoản",
    },
} as const;