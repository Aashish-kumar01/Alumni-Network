package com.alumninetwork.hub.repository;

import com.alumninetwork.hub.entity.DonationCampaign;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonationCampaignRepository extends JpaRepository<DonationCampaign, Long> {

    Page<DonationCampaign> findByActiveTrue(Pageable pageable);

    Page<DonationCampaign> findByCreatedById(Long userId, Pageable pageable);
}
