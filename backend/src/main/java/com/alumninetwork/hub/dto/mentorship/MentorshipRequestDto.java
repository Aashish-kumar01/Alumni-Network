package com.alumninetwork.hub.dto.mentorship;

import com.alumninetwork.hub.dto.user.UserSummaryDto;
import com.alumninetwork.hub.entity.MentorshipStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorshipRequestDto {
    private Long id;
    private UserSummaryDto mentee;
    private UserSummaryDto mentor;
    private String message;
    private String goals;
    private String preferredSchedule;
    private MentorshipStatus status;
    private LocalDateTime scheduledAt;
    private LocalDateTime createdAt;
}
