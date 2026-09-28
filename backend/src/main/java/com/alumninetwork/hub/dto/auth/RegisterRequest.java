package com.alumninetwork.hub.dto.auth;

import com.alumninetwork.hub.entity.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Set;

@Data
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    private Integer graduationYear;
    private String department;
    private String company;
    private String jobTitle;
    private String linkedinUrl;
    private Set<String> skills;
}
