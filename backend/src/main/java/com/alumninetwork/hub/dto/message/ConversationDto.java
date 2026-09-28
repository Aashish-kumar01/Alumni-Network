package com.alumninetwork.hub.dto.message;

import com.alumninetwork.hub.dto.user.UserSummaryDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDto {
    private Long id;
    private UserSummaryDto otherParticipant;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private long unreadCount;
}
