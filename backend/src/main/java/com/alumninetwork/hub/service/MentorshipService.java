package com.alumninetwork.hub.service;

import com.alumninetwork.hub.dto.common.PageResponse;
import com.alumninetwork.hub.dto.mentorship.*;
import com.alumninetwork.hub.entity.*;
import com.alumninetwork.hub.exception.BadRequestException;
import com.alumninetwork.hub.exception.ResourceNotFoundException;
import com.alumninetwork.hub.repository.MentorshipRequestRepository;
import com.alumninetwork.hub.repository.MentorshipReviewRepository;
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
public class MentorshipService {

    private final MentorshipRequestRepository requestRepository;
    private final MentorshipReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public MentorshipRequestDto sendRequest(CreateMentorshipRequest request) {
        User mentee = userService.getCurrentUser();
        User mentor = userRepository.findById(request.getMentorId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getMentorId()));

        if (!mentor.isAvailableForMentorship()) {
            throw new BadRequestException("This user is not available for mentorship");
        }

        if (requestRepository.existsByMenteeIdAndMentorId(mentee.getId(), mentor.getId())) {
            throw new BadRequestException("You already have a mentorship request with this user");
        }

        MentorshipRequest mentorshipRequest = MentorshipRequest.builder()
                .mentee(mentee)
                .mentor(mentor)
                .message(request.getMessage())
                .goals(request.getGoals())
                .preferredSchedule(request.getPreferredSchedule())
                .build();

        MentorshipRequest saved = requestRepository.save(mentorshipRequest);

        notificationService.createNotification(
                mentor.getId(),
                "Mentorship Request",
                mentee.getFullName() + " wants you to be their mentor",
                NotificationType.MENTORSHIP_REQUEST,
                saved.getId()
        );

        return toDto(saved);
    }

    @Transactional
    public MentorshipRequestDto updateStatus(Long requestId, MentorshipStatus status) {
        MentorshipRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MentorshipRequest", "id", requestId));

        User currentUser = userService.getCurrentUser();
        if (!request.getMentor().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Only the mentor can update this request");
        }

        request.setStatus(status);
        request.setUpdatedAt(LocalDateTime.now());
        MentorshipRequest saved = requestRepository.save(request);

        notificationService.createNotification(
                request.getMentee().getId(),
                "Mentorship Request Update",
                "Your mentorship request has been " + status.name().toLowerCase(),
                NotificationType.MENTORSHIP_REQUEST,
                requestId
        );

        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<MentorshipRequestDto> getMyMentorshipRequests(String type, int page, int size) {
        User user = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<MentorshipRequest> result;
        if ("received".equals(type)) {
            result = requestRepository.findByMentorId(user.getId(), pageable);
        } else {
            result = requestRepository.findByMenteeId(user.getId(), pageable);
        }
        List<MentorshipRequestDto> dtos = result.getContent().stream().map(this::toDto).toList();
        return PageResponse.<MentorshipRequestDto>builder().content(dtos).page(result.getNumber()).size(result.getSize())
                .totalElements(result.getTotalElements()).totalPages(result.getTotalPages())
                .first(result.isFirst()).last(result.isLast()).build();
    }

    @Transactional
    public void addReview(Long requestId, CreateReviewRequest request) {
        MentorshipRequest mentorshipRequest = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MentorshipRequest", "id", requestId));

        User reviewer = userService.getCurrentUser();
        if (!mentorshipRequest.getMentee().getId().equals(reviewer.getId())) {
            throw new BadRequestException("Only the mentee can review the mentor");
        }

        if (reviewRepository.findByMentorshipRequestId(requestId).isPresent()) {
            throw new BadRequestException("Review already submitted");
        }

        MentorshipReview review = MentorshipReview.builder()
                .mentorshipRequest(mentorshipRequest)
                .reviewer(reviewer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        reviewRepository.save(review);
    }

    private MentorshipRequestDto toDto(MentorshipRequest r) {
        return MentorshipRequestDto.builder()
                .id(r.getId())
                .mentee(userService.toSummaryDto(r.getMentee()))
                .mentor(userService.toSummaryDto(r.getMentor()))
                .message(r.getMessage())
                .goals(r.getGoals())
                .preferredSchedule(r.getPreferredSchedule())
                .status(r.getStatus())
                .scheduledAt(r.getScheduledAt())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
