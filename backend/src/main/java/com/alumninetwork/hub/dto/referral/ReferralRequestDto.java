package com.alumninetwork.hub.dto.referral;

import com.alumninetwork.hub.dto.job.JobDto;
import com.alumninetwork.hub.dto.user.UserSummaryDto;
import com.alumninetwork.hub.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReferralRequestDto {
    private Long id;
    private UserSummaryDto requester;
    private UserSummaryDto referrer;
    private JobDto job;
    private String message;
    private String targetCompany;
    private String targetRole;
    private String resumeUrl;
    private ApplicationStatus status;
    private LocalDateTime createdAt;
}
