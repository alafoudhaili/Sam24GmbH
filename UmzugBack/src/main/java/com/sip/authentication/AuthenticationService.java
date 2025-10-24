package com.sip.authentication;

import com.sip.config.JwtService;
import com.sip.entities.Role;
import com.sip.entities.User;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthenticationService {
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;



    public AuthenticationResponse register(User request) throws MessagingException {
        User newUser = new User();
        newUser.setNom(request.getNom());
        newUser.setPrenom(request.getPrenom());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setTelephone(request.getTelephone());
        newUser.setPhotoProfil(request.getPhotoProfil());

        newUser.setActive(true);
        newUser.setRole(request.getRole());

            User savedUser = usersRepository.save(newUser);
            var jwtToken = jwtService.generateToken(savedUser);
            return AuthenticationResponse.builder()
                    .user(savedUser)
                    .token(jwtToken)
                    .build();
        }



    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User userLogged;
        try {
            userLogged = usersRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
        var jwtToken = jwtService.generateToken(userLogged);
        return AuthenticationResponse.builder()
                .user(userLogged)
                .token(jwtToken)
                .build();
    }

}

