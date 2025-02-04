package com.datn.beestyle.entity.cart;

import com.datn.beestyle.entity.BaseEntity;
import com.datn.beestyle.entity.user.Customer;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Table(name = "shopping_cart")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShoppingCart extends BaseEntity<Long> {

    @Column(name = "cart_code")
    UUID cartCode;

    @Column(name = "total_amount")
    BigDecimal totalAmount = BigDecimal.ZERO;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    Customer customer;

    @OneToMany(mappedBy = "shoppingCart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShoppingCartItem> items = new ArrayList<>();

    public void saveItem(ShoppingCartItem item) {
        if(item != null) {
            if(items == null) {
                items = new ArrayList<>();
            }
            items.add(item);
            item.setShoppingCart(this);
        }
    }
}
