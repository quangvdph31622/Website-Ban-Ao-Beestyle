package com.datn.beestyle.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import java.io.Serializable;

@Getter
@Setter
@MappedSuperclass
@FieldDefaults(level = AccessLevel.PRIVATE)
public abstract class Auditable<T extends Serializable> extends BaseEntity<T> {

    // user tạo mới record
    @CreatedBy
    @Column(name = "created_by", updatable = false)
    T createdBy;

    // user update cuối cùng
    @LastModifiedBy
    @Column(name = "updated_by", insertable = false)
    T updateBy;
}
