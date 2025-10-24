package com.sip.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.util.StdDateFormat;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sip.authentication.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.TimeZone;

@Configuration
@RequiredArgsConstructor
@EnableScheduling
@EnableAsync
public class ApplicationConfig {

    private final UsersRepository usersRepository;
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            try {
                return (UserDetails) usersRepository.findByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            } catch (Throwable e) {
                throw new RuntimeException(e);
            }
        };

    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();

        // Register the JavaTimeModule to support LocalDateTime, etc.
        objectMapper.registerModule(new JavaTimeModule());

        // Enable serialization with a custom format
        objectMapper.enable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);


        // Use a custom date format and set the time zone
        StdDateFormat stdDateFormat = new StdDateFormat();
        stdDateFormat.setTimeZone(TimeZone.getTimeZone("UTC")); // Set your desired time zone
        objectMapper.setDateFormat(stdDateFormat);

        return objectMapper;
    }




}

