package com.datn.beestyle.entity.product.properties;

import com.datn.beestyle.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Table(name = "size")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Size extends BaseEntity<Integer> {

    @Column(name = "size_name")
    String sizeName;

    @Column(name = "deleted")
    boolean deleted;
}
