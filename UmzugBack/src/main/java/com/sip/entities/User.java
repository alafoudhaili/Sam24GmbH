package com.sip.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
@Table(name = "users",uniqueConstraints = { @UniqueConstraint(columnNames = { "email" }) })
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long id_user;

    @Column
    private String nom;

    @Column
    private String prenom;

    @Column
    @Email
    private String email;

    @Column
    private String password;

    @Column
    private long telephone;


    @Column
    private String photoProfil;



    @NotNull
    @Column
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column
    @JsonIgnore
    private String resetPasswordToken;

    @Column
    private String confirmationCode;

    @Column
    private boolean isActive;
    // New relationship with Affection table
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Affectation> affections = new ArrayList<>();  // Holds all the requests linked to this user
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.toString()));
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return email;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }


}


