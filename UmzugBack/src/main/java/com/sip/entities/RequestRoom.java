package com.sip.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Data

@Entity
public class RequestRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "request_id")
    @com.fasterxml.jackson.annotation.JsonIgnore // avoid back loop in JSON
    private Request request;

    // Reference to the catalog Room (no collection back from Room!)
    @ManyToOne(optional = false)
    @JoinColumn(name = "room_id")
    private Room room;

    @OneToMany(mappedBy = "requestRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Element> elements = new ArrayList<>();
}
