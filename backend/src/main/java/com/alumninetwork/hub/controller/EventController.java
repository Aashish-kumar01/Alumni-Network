package com.alumninetwork.hub.controller;

import com.alumninetwork.hub.dto.common.PageResponse;
import com.alumninetwork.hub.dto.event.*;
import com.alumninetwork.hub.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Events", description = "Event management and RSVPs")
public class EventController {

    private final EventService eventService;

    @GetMapping
    @Operation(summary = "List events with filters")
    public ResponseEntity<PageResponse<EventDto>> getEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean upcoming,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(eventService.getEvents(search, upcoming, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new event")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<EventDto> createEvent(@Valid @RequestBody CreateEventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(request));
    }

    @PostMapping("/{id}/rsvp")
    @Operation(summary = "RSVP to an event")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<EventDto> rsvp(@PathVariable Long id, @RequestBody RsvpRequest request) {
        return ResponseEntity.ok(eventService.rsvp(id, request));
    }
}
