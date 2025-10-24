package com.sip.repositories;

import com.sip.entities.Affectation;
import com.sip.entities.Request;
import com.sip.entities.Room;
import com.sip.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AffectationRepository extends JpaRepository<Affectation,Long>  {

    // Find all affections by a specific user
    List<Affectation> findByUser(User user);

    // Find all affections by a specific request
    List<Affectation> findByRequest(Request request);
}
