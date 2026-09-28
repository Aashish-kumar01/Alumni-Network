package com.alumninetwork.hub.websocket;

import com.alumninetwork.hub.dto.message.MessageDto;
import com.alumninetwork.hub.dto.message.SendMessageRequest;
import com.alumninetwork.hub.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageService messageService;

    @MessageMapping("/chat.send")
    public void sendMessage(SendMessageRequest request) {
        messageService.sendMessage(request);
    }
}
