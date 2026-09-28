package com.alumninetwork.hub.dto.event;

import com.alumninetwork.hub.entity.RsvpStatus;
import lombok.Data;

@Data
public class RsvpRequest {
    private RsvpStatus status;
}
