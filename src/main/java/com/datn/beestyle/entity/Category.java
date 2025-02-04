package com.datn.beestyle.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Table(name = "category")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Category extends BaseEntity<Integer> {

    @Column(name = "category_name")
    String categoryName;

    @Column(name = "description")
    String description;

    @Column(name = "deleted")
    boolean deleted;
}
