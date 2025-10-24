package com.sip.repositories;

import com.sip.entities.Kitchen;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KitchenRepository extends JpaRepository<Kitchen,Long>  {
}
