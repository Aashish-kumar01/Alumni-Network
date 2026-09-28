package com.alumninetwork.hub.repository;

import com.alumninetwork.hub.entity.ReferralRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReferralRequestRepository extends JpaRepository<ReferralRequest, Long> {

    Page<ReferralRequest> findByRequesterId(Long requesterId, Pageable pageable);

    Page<ReferralRequest> findByReferrerId(Long referrerId, Pageable pageable);
}
