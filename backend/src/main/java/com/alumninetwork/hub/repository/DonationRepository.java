package com.alumninetwork.hub.repository;

import com.alumninetwork.hub.entity.Donation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {

    Page<Donation> findByCampaignId(Long campaignId, Pageable pageable);

    Page<Donation> findByDonorId(Long donorId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d")
    BigDecimal sumTotalDonations();

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.campaign.id = :campaignId")
    BigDecimal sumByCampaignId(@Param("campaignId") Long campaignId);
}
