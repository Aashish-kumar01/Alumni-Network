package com.alumninetwork.hub.dto.referral;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateReferralRequest {
    @NotNull(message = "Referrer ID is required")
    private Long referrerId;

    private Long jobId;

    @NotBlank(message = "Target company is required")
    private String targetCompany;

    private String targetRole;
    private String message;
    private String resumeUrl;
}
