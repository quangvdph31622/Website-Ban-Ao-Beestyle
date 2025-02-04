package com.datn.beestyle.entity.author;

import com.datn.beestyle.entity.user.Staff;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Table(name = "role")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {

    @Id
    @Column(name = "name")
    String name;

    @Column(name = "description")
    String description;

    @ManyToMany(mappedBy = "roles")
    private Set<Staff> users = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "role_has_permission",
            joinColumns = {@JoinColumn(name = "role_name", referencedColumnName = "name")},
            inverseJoinColumns = {@JoinColumn(name = "permission_name", referencedColumnName = "name")})
    private Set<Permission> permissions = new HashSet<>();
}
