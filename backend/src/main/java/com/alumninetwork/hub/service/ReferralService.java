package com.alumninetwork.hub.service;

import com.alumninetwork.hub.dto.common.PageResponse;
import com.alumninetwork.hub.dto.referral.*;
import com.alumninetwork.hub.entity.*;
import com.alumninetwork.hub.exception.ResourceNotFoundException;
import com.alumninetwork.hub.repository.JobRepository;
import com.alumninetwork.hub.repository.ReferralRequestRepository;
import com.alumninetwork.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReferralService {

    private final ReferralRequestRepository referralRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public ReferralRequestDto createReferral(CreateReferralRequest request) {
        User requester = userService.getCurrentUser();
        User referrer = userRepository.findById(request.getReferrerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getReferrerId()));

        Job job = request.getJobId() != null ?
                jobRepository.findById(request.getJobId()).orElse(null) : null;

        ReferralRequest referral = ReferralRequest.builder()
                .requester(requester).referrer(referrer).job(job)
                .message(request.getMessage()).targetCompany(request.getTargetCompany())
                .targetRole(request.getTargetRole()).resumeUrl(request.getResumeUrl()).build();

        ReferralRequest saved = referralRepository.save(referral);

        notificationService.createNotification(referrer.getId(), "Referral Request",
                requester.getFullName() + " is requesting a referral at " + request.getTargetCompany(),
                NotificationType.REFERRAL_UPDATE, saved.getId());

        return toDto(saved);
    }

    @Transactional
    public ReferralRequestDto updateStatus(Long id, ApplicationStatus status) {
        ReferralRequest referral = referralRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ReferralRequest", "id", id));
        referral.setStatus(status);
        referral.setUpdatedAt(LocalDateTime.now());
        return toDto(referralRepository.save(referral));
    }

    public PageResponse<ReferralRequestDto> getMyReferrals(String type, int page, int size) {
        User user = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<ReferralRequest> result = "received".equals(type)
                ? referralRepository.findByReferrerId(user.getId(), pageable)
                : referralRepository.findByRequesterId(user.getId(), pageable);
        List<ReferralRequestDto> dtos = result.getContent().stream().map(this::toDto).toList();
        return PageResponse.<ReferralRequestDto>builder().content(dtos).page(result.getNumber()).size(result.getSize())
                .totalElements(result.getTotalElements()).totalPages(result.getTotalPages())
                .first(result.isFirst()).last(result.isLast()).build();
    }

    private ReferralRequestDto toDto(ReferralRequest r) {
        return ReferralRequestDto.builder().id(r.getId())
                .requester(userService.toSummaryDto(r.getRequester()))
                .referrer(userService.toSummaryDto(r.getReferrer()))
                .message(r.getMessage()).targetCompany(r.getTargetCompany())
                .targetRole(r.getTargetRole()).resumeUrl(r.getResumeUrl())
                .status(r.getStatus()).createdAt(r.getCreatedAt()).build();
    }
}
