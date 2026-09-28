package com.alumninetwork.hub.service;

import com.alumninetwork.hub.dto.common.PageResponse;
import com.alumninetwork.hub.dto.event.*;
import com.alumninetwork.hub.entity.*;
import com.alumninetwork.hub.exception.BadRequestException;
import com.alumninetwork.hub.exception.ResourceNotFoundException;
import com.alumninetwork.hub.repository.EventRepository;
import com.alumninetwork.hub.repository.EventRsvpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventRsvpRepository rsvpRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public EventDto createEvent(CreateEventRequest request) {
        User organizer = userService.getCurrentUser();
        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .eventType(request.getEventType())
                .maxAttendees(request.getMaxAttendees())
                .organizer(organizer)
                .build();
        return toDto(eventRepository.save(event), organizer.getId());
    }

    @Transactional(readOnly = true)
    public PageResponse<EventDto> getEvents(String search, Boolean upcoming, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String searchPattern = search != null ? "%" + search.toLowerCase() + "%" : null;
        Page<Event> result = eventRepository.findWithFilters(search, searchPattern, upcoming, LocalDateTime.now(), pageable);

        Long uid = null;
        try { uid = userService.getCurrentUser().getId(); } catch (Exception ignored) {}
        final Long userId = uid;

        List<EventDto> dtos = result.getContent().stream().map(e -> toDto(e, userId)).toList();
        return PageResponse.<EventDto>builder().content(dtos).page(result.getNumber()).size(result.getSize())
                .totalElements(result.getTotalElements()).totalPages(result.getTotalPages())
                .first(result.isFirst()).last(result.isLast()).build();
    }

    @Transactional(readOnly = true)
    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        Long uid = null;
        try { uid = userService.getCurrentUser().getId(); } catch (Exception ignored) {}
        return toDto(event, uid);
    }

    @Transactional
    public EventDto rsvp(Long eventId, RsvpRequest request) {
        User user = userService.getCurrentUser();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        EventRsvp rsvp = rsvpRepository.findByEventIdAndUserId(eventId, user.getId())
                .orElse(EventRsvp.builder().event(event).user(user).build());

        if (request.getStatus() != null) {
            rsvp.setStatus(request.getStatus());
        }
        rsvpRepository.save(rsvp);

        notificationService.createNotification(
                event.getOrganizer().getId(),
                "New RSVP",
                user.getFullName() + " RSVP'd to " + event.getTitle(),
                NotificationType.EVENT_REMINDER,
                eventId
        );

        return toDto(eventRepository.findById(eventId).get(), user.getId());
    }

    private EventDto toDto(Event event, Long currentUserId) {
        long attendeeCount = rsvpRepository.countByEventIdAndStatus(event.getId(), RsvpStatus.GOING);
        boolean userRsvped = currentUserId != null && rsvpRepository.existsByEventIdAndUserId(event.getId(), currentUserId);
        return EventDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .location(event.getLocation())
                .bannerUrl(event.getBannerUrl())
                .eventType(event.getEventType())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .maxAttendees(event.getMaxAttendees())
                .attendeeCount(attendeeCount)
                .published(event.isPublished())
                .organizer(userService.toSummaryDto(event.getOrganizer()))
                .createdAt(event.getCreatedAt())
                .userRsvped(userRsvped)
                .build();
    }
}
