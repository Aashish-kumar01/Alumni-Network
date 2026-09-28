package com.alumninetwork.hub.service;

import com.alumninetwork.hub.dto.common.PageResponse;
import com.alumninetwork.hub.dto.donation.*;
import com.alumninetwork.hub.entity.*;
import com.alumninetwork.hub.exception.ResourceNotFoundException;
import com.alumninetwork.hub.repository.DonationCampaignRepository;
import com.alumninetwork.hub.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationCampaignRepository campaignRepository;
    private final DonationRepository donationRepository;
    private final UserService userService;

    @Transactional
    public CampaignDto createCampaign(CreateCampaignRequest request) {
        User user = userService.getCurrentUser();
        DonationCampaign campaign = DonationCampaign.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .goalAmount(request.getGoalAmount())
                .endDate(request.getEndDate())
                .createdBy(user)
                .build();
        return toDto(campaignRepository.save(campaign));
    }

    @Transactional(readOnly = true)
    public PageResponse<CampaignDto> getCampaigns(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DonationCampaign> result = campaignRepository.findByActiveTrue(pageable);
        List<CampaignDto> dtos = result.getContent().stream().map(this::toDto).toList();
        return PageResponse.<CampaignDto>builder().content(dtos).page(result.getNumber()).size(result.getSize())
                .totalElements(result.getTotalElements()).totalPages(result.getTotalPages())
                .first(result.isFirst()).last(result.isLast()).build();
    }

    @Transactional
    public DonationDto donate(Long campaignId, DonateRequest request) {
        User donor = userService.getCurrentUser();
        DonationCampaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign", "id", campaignId));

        Donation donation = Donation.builder()
                .campaign(campaign)
                .donor(donor)
                .amount(request.getAmount())
                .message(request.getMessage())
                .anonymous(request.isAnonymous())
                .build();

        Donation saved = donationRepository.save(donation);

        campaign.setRaisedAmount(campaign.getRaisedAmount().add(request.getAmount()));
        campaignRepository.save(campaign);

        return toDonationDto(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<DonationDto> getMyDonations(int page, int size) {
        User user = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<Donation> result = donationRepository.findByDonorId(user.getId(), pageable);
        List<DonationDto> dtos = result.getContent().stream().map(this::toDonationDto).toList();
        return PageResponse.<DonationDto>builder().content(dtos).page(result.getNumber()).size(result.getSize())
                .totalElements(result.getTotalElements()).totalPages(result.getTotalPages())
                .first(result.isFirst()).last(result.isLast()).build();
    }

    private CampaignDto toDto(DonationCampaign c) {
        double progress = c.getGoalAmount().compareTo(BigDecimal.ZERO) > 0
                ? c.getRaisedAmount().doubleValue() / c.getGoalAmount().doubleValue() * 100 : 0;
        long donorCount = donationRepository.findByCampaignId(c.getId(), PageRequest.of(0, Integer.MAX_VALUE)).getTotalElements();
        return CampaignDto.builder().id(c.getId()).title(c.getTitle()).description(c.getDescription())
                .goalAmount(c.getGoalAmount()).raisedAmount(c.getRaisedAmount()).progressPercent(Math.min(progress, 100))
                .imageUrl(c.getImageUrl()).endDate(c.getEndDate()).active(c.isActive())
                .createdBy(userService.toSummaryDto(c.getCreatedBy())).donorCount(donorCount)
                .createdAt(c.getCreatedAt()).build();
    }

    private DonationDto toDonationDto(Donation d) {
        return DonationDto.builder().id(d.getId()).campaignId(d.getCampaign().getId())
                .campaignTitle(d.getCampaign().getTitle())
                .donor(d.isAnonymous() ? null : userService.toSummaryDto(d.getDonor()))
                .amount(d.getAmount()).message(d.getMessage()).anonymous(d.isAnonymous())
                .donatedAt(d.getDonatedAt()).build();
    }
}
