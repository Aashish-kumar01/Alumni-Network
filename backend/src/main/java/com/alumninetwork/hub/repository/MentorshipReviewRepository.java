package com.alumninetwork.hub.repository;

import com.alumninetwork.hub.entity.MentorshipReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorshipReviewRepository extends JpaRepository<MentorshipReview, Long> {

    Optional<MentorshipReview> findByMentorshipRequestId(Long requestId);

    List<MentorshipReview> findByMentorshipRequestMentorId(Long mentorId);

    @Query("SELECT AVG(r.rating) FROM MentorshipReview r WHERE r.mentorshipRequest.mentor.id = :mentorId")
    Double findAverageRatingByMentorId(@Param("mentorId") Long mentorId);
}
