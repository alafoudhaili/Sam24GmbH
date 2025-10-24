package com.sip.repositories;

import com.sip.entities.Request;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request,Long> {
    Page<Request> findByClientNameContainingIgnoreCase(String clientName, Pageable pageable);
    Page<Request> findByTotalPriceBetween(Float minPrice, Float maxPrice, Pageable pageable);

}
