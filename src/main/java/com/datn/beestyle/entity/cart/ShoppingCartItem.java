package com.datn.beestyle.entity.cart;

import com.datn.beestyle.entity.product.ProductVariant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Table(name = "shopping_cart_item")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShoppingCartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shopping_cart_id", referencedColumnName = "id")
    ShoppingCart shoppingCart;

    @Column(name = "quantity")
    int quantity;

    @Column(name = "unit_price")
    BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(name = "total_price")
    BigDecimal totalPrice = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id", referencedColumnName = "id")
    ProductVariant productVariant;
}
