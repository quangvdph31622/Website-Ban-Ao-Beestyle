package com.datn.beestyle.entity.product;

import com.datn.beestyle.entity.Auditable;
import com.datn.beestyle.entity.Category;
import com.datn.beestyle.entity.product.properties.Brand;
import com.datn.beestyle.entity.product.properties.Material;
import com.datn.beestyle.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.CascadeType.*;


@Table(name = "product")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product extends Auditable<Long> {

    @Column(name = "product_name")
    String productName;

    @Column(name = "image_url")
    String imageUrl;

    @Column(name = "gender")
    Gender gender;

    @Column(name = "description")
    String description;

    @Column(name = "deleted")
    boolean deleted;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    Material material;



}
