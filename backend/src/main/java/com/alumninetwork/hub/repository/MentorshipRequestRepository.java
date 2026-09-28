package com.alumninetwork.hub.repository;

import com.alumninetwork.hub.entity.MentorshipRequest;
import com.alumninetwork.hub.entity.MentorshipStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorshipRequestRepository extends JpaRepository<MentorshipRequest, Long> {

    Page<MentorshipRequest> findByMenteeId(Long menteeId, Pageable pageable);

    Page<MentorshipRequest> findByMentorId(Long mentorId, Pageable pageable);

    Page<MentorshipRequest> findByMentorIdAndStatus(Long mentorId, MentorshipStatus status, Pageable pageable);

    boolean existsByMenteeIdAndMentorId(Long menteeId, Long mentorId);

    List<MentorshipRequest> findByMenteeIdAndStatus(Long menteeId, MentorshipStatus status);
}
