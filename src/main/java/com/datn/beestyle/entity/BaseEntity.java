package com.datn.beestyle.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
@FieldDefaults(level = AccessLevel.PRIVATE)
public abstract class BaseEntity<T extends Serializable> implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    T id;

    // lưu thời gian record được tạo ra
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    LocalDateTime createdAt;

    // lưu thời gian record được update lần cuối
    @Column(name = "updated_at")
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    LocalDateTime updatedAt;
}
