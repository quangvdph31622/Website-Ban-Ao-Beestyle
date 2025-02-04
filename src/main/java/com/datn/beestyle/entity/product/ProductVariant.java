package com.datn.beestyle.entity.product;

import com.datn.beestyle.entity.Auditable;
import com.datn.beestyle.entity.Promotion;
import com.datn.beestyle.entity.product.properties.Color;
import com.datn.beestyle.entity.product.properties.Size;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.CascadeType.*;

@Table(name = "product_variant")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductVariant extends Auditable<Long> {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_id", referencedColumnName = "id")
    Color color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "size_id", referencedColumnName = "id")
    Size size;

    @Column(name = "original_price")
    BigDecimal originalPrice = BigDecimal.ZERO;

    @Column(name = "sale_price")
    BigDecimal salePrice = BigDecimal.ZERO;

    @Column(name = "quantity_in_stock")
    int quantityInStock;

    @Column(name = "deleted")
    boolean deleted;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {PERSIST, MERGE})
    @JoinColumn(name = "promotion_id", referencedColumnName = "id")
    Promotion promotion;

    @OneToMany(mappedBy = "productVariant", cascade = {PERSIST, MERGE, REMOVE}, fetch = FetchType.LAZY)
    List<ProductImage> productImages = new ArrayList<>();
}
