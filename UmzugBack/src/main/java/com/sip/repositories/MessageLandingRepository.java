package com.sip.repositories;

import com.sip.entities.MessageLanding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface MessageLandingRepository extends JpaRepository<MessageLanding,Long> {

    @Query("SELECT COALESCE(SUM(u.unreadLandingCount), 0) FROM MessageLanding u")
    Integer sumUnreadLandingMessages();

    @Modifying
    @Query("UPDATE MessageLanding u SET u.unreadLandingCount = 0")
    void resetAllUnreadLandingMessagesCounts();

    @Query("SELECT COUNT(m) FROM MessageLanding m WHERE m.unreadLandingCount > 0")
    int countUnreadMessages();
}
