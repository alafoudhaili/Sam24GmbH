package com.sip.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Element {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_element")
    private Long id_element;

    @Column
    private int numberElement;

    @Column
    private String name;

    @Column
    private Float width;

    @Column
    private Float height;

    @Column
    private Float length;



    @Column
    private Float q2;

    @ManyToOne(optional = false)
    @JoinColumn(name = "request_room_id")
    @com.fasterxml.jackson.annotation.JsonIgnore // avoid back loop in JSON

    private RequestRoom requestRoom;
    @Column
    private Float price;

}