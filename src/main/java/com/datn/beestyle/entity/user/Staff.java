package com.datn.beestyle.entity.user;

import com.datn.beestyle.entity.Address;
import com.datn.beestyle.entity.Auditable;
import com.datn.beestyle.entity.author.Role;
import com.datn.beestyle.enums.Gender;
import com.datn.beestyle.enums.StaffStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import static jakarta.persistence.CascadeType.ALL;

@Table(name = "staff")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Staff extends Auditable<Long> {

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

    @Column(name = "avatar")
    String avatar;

    @Column(name = "address")
    String address;

    @Column(name = "password")
    String password;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    StaffStatus staffStatus;

    @Column(name = "deleted")
    boolean deleted;

    @ManyToMany
    @JoinTable(name = "user_has_role",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "role_name", referencedColumnName = "name")})
    private Set<Role> roles = new HashSet<>();
}
