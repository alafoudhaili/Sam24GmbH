package com.sip.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id_settings;

    @Column(columnDefinition = "TEXT")
    private String apropos;

    @Column(columnDefinition = "TEXT")
    private String apropos2;

    @Column(columnDefinition = "TEXT")
    private String apropos3;

    @Column(columnDefinition = "TEXT")
    private String objective;

    @Column(columnDefinition = "TEXT")
    private String mission;

    @Column(columnDefinition = "TEXT")
    private String vision;

    @Column(columnDefinition = "TEXT")
    private String motto;

    @Column(columnDefinition = "TEXT")
    private String titreService;

    @Column
    private String titre;

    @Column
    private String logo;

    @Column
    private Long telephone;

    @Column
    private Long whatsapp;

    @Column
    private String email;

    @Column
    private String banner;

    @Column
    private String dimensionLogo;

    @Column
    private String Adresse;

    @Column
    private LocalTime  HeureDebut;
    @Column
    private LocalTime HeureFin;
}
