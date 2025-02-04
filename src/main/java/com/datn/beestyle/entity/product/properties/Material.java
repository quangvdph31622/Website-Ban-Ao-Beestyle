package com.datn.beestyle.entity.product.properties;

import com.datn.beestyle.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Table(name = "material")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Material extends BaseEntity<Integer> {

    @Column(name = "material_name")
    String materialName;

    @Column(name = "deleted")
    boolean deleted;
}
