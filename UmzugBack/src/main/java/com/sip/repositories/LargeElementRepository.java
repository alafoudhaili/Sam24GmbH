package com.sip.repositories;

import com.sip.entities.LargeElement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LargeElementRepository extends JpaRepository<LargeElement,Long> {
}
