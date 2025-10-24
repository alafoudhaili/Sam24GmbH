package com.sip.repositories;

import com.sip.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByResetPasswordToken(String resetPasswordToken);

    boolean existsByEmail(String email);

    User findByEmail(String email);

    @Query("SELECT a FROM User a WHERE a.role = 'ADMIN'")
    List<User> findAdmins();

    @Query("SELECT a FROM User a WHERE a.role = 'MITARBEITER'")
    List<User> findMitarbieter();


}
