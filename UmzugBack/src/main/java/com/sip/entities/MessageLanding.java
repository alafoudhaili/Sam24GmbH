package com.sip.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "MessageLanding")
@JsonIgnoreProperties(ignoreUnknown = true)
public class MessageLanding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_message_landing;

    @Column
    private String nom;

    @Column
    private Long telephone;

    @Column
    private String email;

    @Column
    private String objet;

    @Column
    private String message;

    @Column
    private String lu;

    @Column
    private LocalDateTime date;

    @Column
    private int unreadLandingCount;

}
