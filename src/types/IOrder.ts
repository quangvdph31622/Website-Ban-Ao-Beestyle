import {IVoucher} from "@/types/IVoucher";
import {IAddress} from "@/types/IAddress";
import {ICreateOrUpdateOrderItem} from "@/types/IOrderItem";


export interface IOrder {
    id: number;
    orderTrackingNumber: string;
    customerId?: number;
    customerName?: string;
    phoneNumberCustomer?: string;
    receiverName?: string;
    phoneNumber?: string;
    shippingFee?: number;
    totalAmount?: number;
    paymentDate?: Date;
    paymentMethod?: string;
    pickupMethod?: string;
    orderChannel?: string;
    orderType?: string;
    orderStatus?: string;
    note?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: number;
    updatedBy?: number;
}

export interface IOrderDetail {
    id: number;
    orderTrackingNumber: string;
    customerId?: number;
    customerInfo?: ICustomer;
    voucherId?: number;
    voucherInfo?: IVoucher;
    shippingAddressId?: number;
    shippingAddress?: IAddress;
    receiverName?: string;
    phoneNumber?: string;
    shippingFee?: number;
    totalAmount?: number;
    paymentMethod?: string;
    isPrepaid?: boolean;
    paymentDate?: Date;
    orderChannel?: string;
    orderType?: string;
    orderStatus?: string;
    note?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: number;
    updatedBy?: number;
}

export interface IOrderCreateOrUpdate {
    id?: number;
    orderTrackingNumber?: string;
    customerId?: number;
    voucherId?: number;
    receiverName?: string;
    phoneNumber?: string;
    email?: string;
    shippingAddressId?: number;
    shippingAddress?: IAddress;
    shippingFee?: number;
    originalAmount?: number;
    discountAmount?: number;
    totalAmount?: number;
    amountPaid?: number;
    paymentDate?: Date;
    paymentMethod?: string;
    isPrepaid?: boolean;
    orderChannel?: string;
    orderType?: string;
    orderStatus?: string;
    note?: string;
}

export interface IOrderOnlineCreateOrUpdate {
    id?: number;
    customerId?: number;
    voucherId: number;
    receiverName: string;
    phoneNumber: string;
    email: string;
    shippingAddressId?: number;
    shippingAddress: string;
    shippingFee: number;
    originalAmount: number;
    discountAmount: number;
    totalAmount: number;
    amountPaid?: number;
    paymentDate?: Date;
    paymentMethod: string;
    isPrepaid: boolean;
    orderChannel: string;
    orderType: string;
    orderStatus: string;
    note?: string;
    orderItems: ICreateOrUpdateOrderItem[];
}

export interface IOrderedByUser {
    id?: number;
    orderTrackingNumber?: string;
    orderStatus?: string;
    orderChannel: string;
    orderType: string;
    totalAmount?: number;
    createdAt?: Date;
}
