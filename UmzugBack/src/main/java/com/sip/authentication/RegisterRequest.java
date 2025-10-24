package com.sip.authentication;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String email;
    private String password;
    private  String role;
    private int telephone;
    private String adresse;
    private String matriculeFiscale;
    private String cin;
    private String photoProfil;
}