package com.datn.beestyle.entity.order;

import com.datn.beestyle.entity.order.Order;
import com.datn.beestyle.entity.product.ProductVariant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Table(name = "order_item")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;

    @Column(name = "quantity")
    int quantity;

    @Column(name = "price")
    BigDecimal price = BigDecimal.ZERO;

    @Column(name = "note")
    String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id", referencedColumnName = "id")
    ProductVariant productVariant;
}
