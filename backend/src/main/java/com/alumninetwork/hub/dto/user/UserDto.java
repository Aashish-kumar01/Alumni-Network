package com.alumninetwork.hub.dto.user;

import com.alumninetwork.hub.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private Integer graduationYear;
    private String department;
    private String company;
    private String jobTitle;
    private String bio;
    private String linkedinUrl;
    private String profilePhotoUrl;
    private String resumeUrl;
    private Set<String> skills;
    private boolean availableForMentorship;
    private boolean isApproved;
    private LocalDateTime createdAt;
    private Double averageRating;
}
