package com.alumninetwork.hub.repository;

import com.alumninetwork.hub.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("""
        SELECT j FROM Job j
        WHERE j.active = true
        AND (:search IS NULL OR LOWER(j.title) LIKE :searchPattern
             OR LOWER(j.company) LIKE :searchPattern)
        AND (:location IS NULL OR LOWER(j.location) LIKE :locationPattern)
        AND (:company IS NULL OR LOWER(j.company) LIKE :companyPattern)
        ORDER BY j.createdAt DESC
        """)
    Page<Job> findWithFilters(
            @Param("search") String search,
            @Param("searchPattern") String searchPattern,
            @Param("location") String location,
            @Param("locationPattern") String locationPattern,
            @Param("company") String company,
            @Param("companyPattern") String companyPattern,
            Pageable pageable);

    Page<Job> findByPostedByIdAndActiveTrue(Long userId, Pageable pageable);

    long countByActiveTrue();
}
