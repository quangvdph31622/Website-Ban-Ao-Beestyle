package com.datn.beestyle.entity.order;

import com.datn.beestyle.entity.Address;
import com.datn.beestyle.entity.Auditable;
import com.datn.beestyle.entity.user.Customer;
import com.datn.beestyle.entity.Voucher;
import com.datn.beestyle.enums.OrderChannel;
import com.datn.beestyle.enums.OrderStatus;
import com.datn.beestyle.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Table(name = "order")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order extends Auditable<Long> {

    @Column(name = "order_tracking_number")
    String orderTrackingNumber;

    @Column(name = "phone_number")
    String phoneNumber;

    @Column(name = "shipping_fee")
    BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(name = "total_amount")
    BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "payment_date")
    @Temporal(TemporalType.TIMESTAMP)
    Timestamp paymentDate;

    @Column(name = "payment_method")
    @Enumerated(EnumType.STRING)
    PaymentMethod paymentMethod;

    @Column(name = "order_channel")
    @Enumerated(EnumType.STRING)
    OrderChannel orderChannel;

    @Column(name = "order_status")
    @Enumerated(EnumType.STRING)
    OrderStatus orderStatus;

    @Column(name = "note")
    String note;

    @Column(name = "deleted")
    boolean deleted;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", referencedColumnName = "id")
    Voucher voucher;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shipping_address_id", referencedColumnName = "id")
    Address shippingAddress;
}
