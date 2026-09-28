package com.alumninetwork.hub.dto.user;

import lombok.Data;

import java.util.Set;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String bio;
    private String company;
    private String jobTitle;
    private String department;
    private Integer graduationYear;
    private String linkedinUrl;
    private Set<String> skills;
    private Boolean availableForMentorship;
}
