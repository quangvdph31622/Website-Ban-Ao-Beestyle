package com.datn.beestyle.entity;

import com.datn.beestyle.entity.Auditable;
import com.datn.beestyle.enums.DiscountType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Table(name = "voucher")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Voucher extends Auditable<Long> {

    @Column(name = "voucher_code")
    String voucherCode;

    @Column(name = "discount_type")
    @Enumerated(EnumType.STRING)
    DiscountType discountType;

    @Column(name = "discount_value")
    int discountValue;

    @Column(name = "max_discount")
    int maxDiscount;

    @Column(name = "min_order_value")
    BigDecimal minOrderValue = BigDecimal.ZERO;

    @Column(name = "start_date")
    @Temporal(TemporalType.TIMESTAMP)
    Timestamp startDate;

    @Column(name = "end_date")
    @Temporal(TemporalType.TIMESTAMP)
    Timestamp endDate;

    @Column(name = "usage_limit")
    int usageLimit;

    @Column(name = "usage_per_user")
    int usagePerUser;

    @Column(name = "deleted")
    boolean deleted;
}
