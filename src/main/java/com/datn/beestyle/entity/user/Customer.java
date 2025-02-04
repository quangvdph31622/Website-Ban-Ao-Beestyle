package com.datn.beestyle.entity.user;

import com.datn.beestyle.entity.Address;
import com.datn.beestyle.entity.BaseEntity;
import com.datn.beestyle.entity.author.Role;
import com.datn.beestyle.entity.cart.ShoppingCart;
import com.datn.beestyle.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import static jakarta.persistence.CascadeType.*;

@Table(name = "customer")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Customer extends BaseEntity<Long> {

    @Column(name = "full_name")
    String fullName;

    @Column(name = "date_of_birth")
    @Temporal(TemporalType.DATE)
    LocalDate dateOfBirth;

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    Gender gender;

    @Column(name = "phone_number")
    String phoneNumber;

    @Column(name = "email")
    String email;

    @Column(name = "password")
    String password;

    @Column(name = "deleted")
    boolean deleted;

    @OneToOne(fetch = FetchType.LAZY, cascade = ALL)
    ShoppingCart shoppingCart;

    @OneToMany(mappedBy = "customer", cascade = ALL, fetch = FetchType.LAZY)
    Set<Address> addresses = new HashSet<>();

    public void saveAddress(Address address) {
        if (address != null) {
            if (addresses == null) {
                addresses = new HashSet<>();
            }
            addresses.add(address);
            address.setCustomer(this); // save customer id
        }
    }
}
