package com.alumninetwork.hub.repository;

import com.alumninetwork.hub.entity.EventRsvp;
import com.alumninetwork.hub.entity.RsvpStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRsvpRepository extends JpaRepository<EventRsvp, Long> {

    Optional<EventRsvp> findByEventIdAndUserId(Long eventId, Long userId);

    List<EventRsvp> findByEventId(Long eventId);

    List<EventRsvp> findByUserId(Long userId);

    long countByEventIdAndStatus(Long eventId, RsvpStatus status);

    boolean existsByEventIdAndUserId(Long eventId, Long userId);
}
