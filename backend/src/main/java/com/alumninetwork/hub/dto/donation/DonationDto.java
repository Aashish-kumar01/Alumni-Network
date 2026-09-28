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
public class DonationDto {
    private Long id;
    private Long campaignId;
    private String campaignTitle;
    private UserSummaryDto donor;
    private BigDecimal amount;
    private String message;
    private boolean anonymous;
    private LocalDateTime donatedAt;
}
