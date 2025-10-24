package com.sip.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LargeElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_largeElement;

    @Column
    private String name;

    @Column
    private Float price;
}
