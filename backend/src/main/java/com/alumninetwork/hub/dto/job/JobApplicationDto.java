package com.alumninetwork.hub.dto.job;

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
public class JobApplicationDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;
    private UserSummaryDto applicant;
    private ApplicationStatus status;
    private String coverLetter;
    private String resumeUrl;
    private LocalDateTime appliedAt;
}
