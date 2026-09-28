package com.alumninetwork.hub.repository;

import com.alumninetwork.hub.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    Page<JobApplication> findByApplicantId(Long applicantId, Pageable pageable);

    Page<JobApplication> findByJobId(Long jobId, Pageable pageable);

    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);

    Optional<JobApplication> findByJobIdAndApplicantId(Long jobId, Long applicantId);

    long countByJobId(Long jobId);
}
