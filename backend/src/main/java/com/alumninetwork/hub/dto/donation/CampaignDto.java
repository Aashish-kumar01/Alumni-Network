package com.alumninetwork.hub.dto.donation;

import com.alumninetwork.hub.dto.user.UserSummaryDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal goalAmount;
    private BigDecimal raisedAmount;
    private double progressPercent;
    private String imageUrl;
    private LocalDateTime endDate;
    private boolean active;
    private UserSummaryDto createdBy;
    private long donorCount;
    private LocalDateTime createdAt;
}
