package com.alumninetwork.hub.dto.user;

import com.alumninetwork.hub.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDto {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String department;
    private String company;
    private String jobTitle;
    private String profilePhotoUrl;
    private Integer graduationYear;
    private boolean availableForMentorship;
}
