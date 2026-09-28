package com.alumninetwork.hub.dto.job;

import com.alumninetwork.hub.dto.user.UserSummaryDto;
import com.alumninetwork.hub.entity.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDto {
    private Long id;
    private String title;
    private String company;
    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String description;
    private Set<String> requiredSkills;
    private JobType jobType;
    private LocalDateTime deadline;
    private boolean active;
    private UserSummaryDto postedBy;
    private LocalDateTime createdAt;
    private long applicationCount;
    private boolean alreadyApplied;
}
