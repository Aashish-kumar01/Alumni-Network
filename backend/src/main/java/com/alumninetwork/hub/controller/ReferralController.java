package com.alumninetwork.hub.controller;

import com.alumninetwork.hub.dto.common.PageResponse;
import com.alumninetwork.hub.dto.referral.*;
import com.alumninetwork.hub.entity.ApplicationStatus;
import com.alumninetwork.hub.service.ReferralService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/referrals")
@RequiredArgsConstructor
@Tag(name = "Referrals", description = "Job referral requests")
@SecurityRequirement(name = "bearerAuth")
public class ReferralController {

    private final ReferralService referralService;

    @PostMapping
    @Operation(summary = "Request a job referral")
    public ResponseEntity<ReferralRequestDto> createReferral(@Valid @RequestBody CreateReferralRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(referralService.createReferral(request));
    }

    @GetMapping
    @Operation(summary = "Get my referral requests (sent or received)")
    public ResponseEntity<PageResponse<ReferralRequestDto>> getMyReferrals(
            @RequestParam(defaultValue = "sent") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(referralService.getMyReferrals(type, page, size));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update referral status")
    public ResponseEntity<ReferralRequestDto> updateStatus(
            @PathVariable Long id, @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(referralService.updateStatus(id, status));
    }
}
