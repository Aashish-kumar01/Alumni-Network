package com.alumninetwork.hub.controller;

import com.alumninetwork.hub.dto.common.ApiResponse;
import com.alumninetwork.hub.dto.common.PageResponse;
import com.alumninetwork.hub.dto.mentorship.*;
import com.alumninetwork.hub.entity.MentorshipStatus;
import com.alumninetwork.hub.service.MentorshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mentorship")
@RequiredArgsConstructor
@Tag(name = "Mentorship", description = "Mentorship requests and sessions")
@SecurityRequirement(name = "bearerAuth")
public class MentorshipController {

    private final MentorshipService mentorshipService;

    @PostMapping("/request")
    @Operation(summary = "Send a mentorship request")
    public ResponseEntity<MentorshipRequestDto> sendRequest(@Valid @RequestBody CreateMentorshipRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mentorshipService.sendRequest(request));
    }

    @GetMapping
    @Operation(summary = "Get my mentorship requests (sent or received)")
    public ResponseEntity<PageResponse<MentorshipRequestDto>> getMyRequests(
            @RequestParam(defaultValue = "sent") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(mentorshipService.getMyMentorshipRequests(type, page, size));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Accept or reject a mentorship request")
    public ResponseEntity<MentorshipRequestDto> updateStatus(
            @PathVariable Long id, @RequestParam MentorshipStatus status) {
        return ResponseEntity.ok(mentorshipService.updateStatus(id, status));
    }

    @PostMapping("/{id}/review")
    @Operation(summary = "Add a review for a completed mentorship")
    public ResponseEntity<ApiResponse> addReview(
            @PathVariable Long id, @Valid @RequestBody CreateReviewRequest request) {
        mentorshipService.addReview(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Review submitted"));
    }
}
