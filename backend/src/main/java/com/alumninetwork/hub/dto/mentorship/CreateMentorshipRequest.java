package com.alumninetwork.hub.dto.mentorship;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateMentorshipRequest {
    @NotNull(message = "Mentor ID is required")
    private Long mentorId;

    private String message;
    private String goals;
    private String preferredSchedule;
}
