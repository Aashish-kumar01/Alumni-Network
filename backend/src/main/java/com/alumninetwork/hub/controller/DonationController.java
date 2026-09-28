package com.alumninetwork.hub.controller;

import com.alumninetwork.hub.dto.common.PageResponse;
import com.alumninetwork.hub.dto.donation.*;
import com.alumninetwork.hub.service.DonationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
@Tag(name = "Donations", description = "Donation campaigns and contributions")
public class DonationController {

    private final DonationService donationService;

    @GetMapping("/campaigns")
    @Operation(summary = "Get active donation campaigns")
    public ResponseEntity<PageResponse<CampaignDto>> getCampaigns(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(donationService.getCampaigns(page, size));
    }

    @PostMapping("/campaigns")
    @Operation(summary = "Create a donation campaign")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<CampaignDto> createCampaign(@Valid @RequestBody CreateCampaignRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(donationService.createCampaign(request));
    }

    @PostMapping("/campaigns/{id}/donate")
    @Operation(summary = "Donate to a campaign")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<DonationDto> donate(@PathVariable Long id, @Valid @RequestBody DonateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(donationService.donate(id, request));
    }

    @GetMapping("/my-donations")
    @Operation(summary = "Get my donation history")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<PageResponse<DonationDto>> getMyDonations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(donationService.getMyDonations(page, size));
    }
}
