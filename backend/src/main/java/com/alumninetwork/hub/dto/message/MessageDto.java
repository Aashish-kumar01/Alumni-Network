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
public class MessageDto {
    private Long id;
    private Long conversationId;
    private UserSummaryDto sender;
    private String content;
    private boolean isRead;
    private String attachmentUrl;
    private LocalDateTime sentAt;
}
