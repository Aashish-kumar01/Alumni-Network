package com.alumninetwork.hub.repository;

import com.alumninetwork.hub.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("""
        SELECT e FROM Event e
        WHERE e.published = true
        AND (:search IS NULL OR LOWER(e.title) LIKE :searchPattern)
        AND (:upcoming IS NULL OR (:upcoming = true AND e.startDate >= :now)
             OR (:upcoming = false AND e.startDate < :now))
        ORDER BY e.startDate ASC
        """)
    Page<Event> findWithFilters(
            @Param("search") String search,
            @Param("searchPattern") String searchPattern,
            @Param("upcoming") Boolean upcoming,
            @Param("now") LocalDateTime now,
            Pageable pageable);

    Page<Event> findByOrganizerId(Long organizerId, Pageable pageable);

    long count();
}
