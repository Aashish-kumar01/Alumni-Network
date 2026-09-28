package com.alumninetwork.hub.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDto {
    private long totalUsers;
    private long totalAlumni;
    private long totalStudents;
    private long totalJobs;
    private long totalEvents;
    private long totalMentorshipRequests;
    private long totalDonations;
    private BigDecimal totalDonationAmount;
}
