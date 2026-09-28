package com.alumninetwork.hub.repository;

import com.alumninetwork.hub.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByConversationIdOrderBySentAtAsc(Long conversationId, Pageable pageable);

    long countByConversationIdAndIsReadFalseAndSenderIdNot(Long conversationId, Long userId);

    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.conversation.id = :conversationId AND m.sender.id != :userId AND m.isRead = false")
    void markAllAsRead(@Param("conversationId") Long conversationId, @Param("userId") Long userId);

    java.util.Optional<Message> findTopByConversationIdOrderBySentAtDesc(Long conversationId);
}
