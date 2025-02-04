export interface IPromotion {
    id: number;
    promotionName: string;
    discountType: string;
    discountValue: number;
    startDate: Date;
    endDate: Date;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: number;
    updatedBy?: number;
    status: number;
}