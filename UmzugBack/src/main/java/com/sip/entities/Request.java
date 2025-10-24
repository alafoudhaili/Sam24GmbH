package com.sip.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_request;

    @Column
    private String clientName;

    @Column
    private String clientEmail;

    @Column
    private String departPoint;

    @Column
    private String arrivalPoint;
    @Column
    private String phone;
    @Column
    private Float distanceKm;

    @Column
    private Integer numberOfEtagesDepart;
    @Column
    private Integer numberOfEtagesArrival;

    @Column
    private boolean withElevatorDepart;
    @Column
    private boolean withElevatorArrival;
    @Column
    private boolean withDemontage;

    @Column
    private boolean withMontage;

    @Column
    private boolean withDemontageLamp;

    @Column
    private boolean withMontageLamp;

    @Column
    private boolean withParkPlatzDepart;

    @Column
    private boolean withParkPlatzArrival;
    @Column
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", shape = JsonFormat.Shape.STRING)
    private LocalDateTime date;
    @Column
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", shape = JsonFormat.Shape.STRING)
    private LocalDateTime umzugdate;
    @Column
    private Integer numberOfKartons;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequestRoom> rooms = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "id_kitchen")
    private Kitchen kitchen;

    @Column
    private Float totalPrice;

    @Column
    private Float totalVolumeM3;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Affectation> affections = new ArrayList<>();  // Holds all the users linked to this request
    public boolean getWithDemontage() {
        return withDemontage;
    }
    public boolean getWithMontage() {
        return withMontage;
    }

    public boolean getWithDemontageLamp() {
        return withDemontageLamp;
    }
    public boolean getWithMontageLamp() {
        return withMontageLamp;
    }
    public boolean getWithElevatorDepart() {
        return withElevatorDepart;
    }
    public boolean getWithElevatorArrival() {
        return withElevatorArrival;
    }

    public boolean getWithParkPlatzDepart() {
        return withParkPlatzDepart;
    }
    public boolean getWithParkPlatzArrival() {
        return withParkPlatzArrival;
    }

}