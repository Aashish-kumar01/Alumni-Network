package com.alumninetwork.hub.dto.job;

import com.alumninetwork.hub.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class CreateJobRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Company is required")
    private String company;

    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;

    @NotBlank(message = "Description is required")
    private String description;

    private Set<String> requiredSkills;
    private JobType jobType;
    private LocalDateTime deadline;
}
