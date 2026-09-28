package com.alumninetwork.hub.service;

import com.alumninetwork.hub.dto.message.*;
import com.alumninetwork.hub.entity.*;
import com.alumninetwork.hub.exception.ResourceNotFoundException;
import com.alumninetwork.hub.repository.ConversationRepository;
import com.alumninetwork.hub.repository.MessageRepository;
import com.alumninetwork.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<ConversationDto> getConversations() {
        User currentUser = userService.getCurrentUser();
        return conversationRepository.findByParticipantId(currentUser.getId())
                .stream().map(c -> toConversationDto(c, currentUser.getId())).toList();
    }

    @Transactional
    public MessageDto sendMessage(SendMessageRequest request) {
        User sender = userService.getCurrentUser();
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getRecipientId()));

        Conversation conversation = conversationRepository
                .findBetweenUsers(sender.getId(), recipient.getId())
                .orElseGet(() -> conversationRepository.save(
                        Conversation.builder().participant1(sender).participant2(recipient).build()));

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(request.getContent())
                .attachmentUrl(request.getAttachmentUrl())
                .build();

        Message saved = messageRepository.save(message);
        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        MessageDto dto = toMessageDto(saved);
        messagingTemplate.convertAndSendToUser(recipient.getId().toString(), "/queue/messages", dto);
        return dto;
    }

    @Transactional
    public List<MessageDto> getMessages(Long conversationId, int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> result = messageRepository.findByConversationIdOrderBySentAtAsc(conversationId, pageable);
        messageRepository.markAllAsRead(conversationId, currentUser.getId());
        return result.getContent().stream().map(this::toMessageDto).toList();
    }

    private ConversationDto toConversationDto(Conversation c, Long currentUserId) {
        User other = c.getParticipant1().getId().equals(currentUserId) ? c.getParticipant2() : c.getParticipant1();
        long unread = messageRepository.countByConversationIdAndIsReadFalseAndSenderIdNot(c.getId(), currentUserId);
        // Get last message safely without accessing lazy collection
        String lastMsg = messageRepository.findTopByConversationIdOrderBySentAtDesc(c.getId())
                .map(Message::getContent).orElse(null);
        return ConversationDto.builder().id(c.getId()).otherParticipant(userService.toSummaryDto(other))
                .lastMessage(lastMsg).lastMessageAt(c.getLastMessageAt()).unreadCount(unread).build();
    }

    private MessageDto toMessageDto(Message m) {
        return MessageDto.builder().id(m.getId()).conversationId(m.getConversation().getId())
                .sender(userService.toSummaryDto(m.getSender())).content(m.getContent())
                .isRead(m.isRead()).attachmentUrl(m.getAttachmentUrl()).sentAt(m.getSentAt()).build();
    }
}
