package com.sip.repositories;

import com.sip.entities.MessageLanding;
import com.sip.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room,Long>  {
}
