package com.sip.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Kitchen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_kitchen;

    @Column
    private boolean assemblage ;

    @Column
    private boolean dessemblage ;

    @Column
    private boolean newKitchen ;

    @Column
    private boolean transportKitchen ;

    @Column
    private Float price;
    @Column
    private Float meters;  // ADD THIS FIELD

}
