package com.alumninetwork.hub.dto.event;

import com.alumninetwork.hub.dto.user.UserSummaryDto;
import com.alumninetwork.hub.entity.EventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String bannerUrl;
    private EventType eventType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxAttendees;
    private long attendeeCount;
    private boolean published;
    private UserSummaryDto organizer;
    private LocalDateTime createdAt;
    private boolean userRsvped;
}
