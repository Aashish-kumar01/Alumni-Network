package com.alumninetwork.hub.controller;

import com.alumninetwork.hub.dto.common.PageResponse;
import com.alumninetwork.hub.dto.user.*;
import com.alumninetwork.hub.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profiles and directory")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<UserDto> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUserDto());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<UserDto> updateProfile(@RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @GetMapping("/alumni")
    @Operation(summary = "Get alumni directory with filters")
    public ResponseEntity<PageResponse<UserDto>> getAlumniDirectory(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer graduationYear,
            @RequestParam(required = false) String company,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(userService.getAlumniDirectory(search, department, graduationYear, company, page, size));
    }

    @GetMapping("/suggestions/alumni")
    @Operation(summary = "Get suggested alumni")
    public ResponseEntity<List<UserSummaryDto>> getSuggestedAlumni() {
        return ResponseEntity.ok(userService.getSuggestedAlumni());
    }

    @GetMapping("/suggestions/mentors")
    @Operation(summary = "Get suggested mentors")
    public ResponseEntity<List<UserSummaryDto>> getSuggestedMentors() {
        return ResponseEntity.ok(userService.getSuggestedMentors());
    }
}
