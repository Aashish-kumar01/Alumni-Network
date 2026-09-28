package com.alumninetwork.hub.service;

import com.alumninetwork.hub.dto.common.PageResponse;
import com.alumninetwork.hub.dto.user.UpdateProfileRequest;
import com.alumninetwork.hub.dto.user.UserDto;
import com.alumninetwork.hub.dto.user.UserSummaryDto;
import com.alumninetwork.hub.entity.Role;
import com.alumninetwork.hub.entity.User;
import com.alumninetwork.hub.exception.ResourceNotFoundException;
import com.alumninetwork.hub.repository.MentorshipReviewRepository;
import com.alumninetwork.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MentorshipReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUserDto() {
        return toDto(getCurrentUser());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return toDto(user);
    }

    @Transactional
    public UserDto updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getCompany() != null) user.setCompany(request.getCompany());
        if (request.getJobTitle() != null) user.setJobTitle(request.getJobTitle());
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
        if (request.getGraduationYear() != null) user.setGraduationYear(request.getGraduationYear());
        if (request.getLinkedinUrl() != null) user.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getSkills() != null) user.setSkills(request.getSkills());
        if (request.getAvailableForMentorship() != null)
            user.setAvailableForMentorship(request.getAvailableForMentorship());

        return toDto(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public PageResponse<UserDto> getAlumniDirectory(
            String search, String department, Integer graduationYear,
            String company, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("fullName").ascending());
        String searchPattern = search != null ? "%" + search.toLowerCase() + "%" : null;
        String companyPattern = company != null ? "%" + company.toLowerCase() + "%" : null;
        Page<User> result = userRepository.findAlumniWithFilters(
                Role.ALUMNI, department, graduationYear, company, companyPattern, search, searchPattern, pageable);

        List<UserDto> dtos = result.getContent().stream().map(this::toDto).toList();
        return PageResponse.<UserDto>builder()
                .content(dtos)
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDto> getSuggestedAlumni() {
        Pageable pageable = PageRequest.of(0, 6, Sort.by("createdAt").descending());
        return userRepository.findMentors(Role.ALUMNI, pageable)
                .stream().map(this::toSummaryDto).toList();
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDto> getSuggestedMentors() {
        Pageable pageable = PageRequest.of(0, 6);
        return userRepository.findMentors(Role.ALUMNI, pageable)
                .stream().map(this::toSummaryDto).toList();
    }

    @Transactional
    public void updateProfilePhoto(Long userId, String photoUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setProfilePhotoUrl(photoUrl);
        userRepository.save(user);
    }

    @Transactional
    public void updateResume(Long userId, String resumeUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setResumeUrl(resumeUrl);
        userRepository.save(user);
    }

    public UserDto toDto(User user) {
        Double avgRating = reviewRepository.findAverageRatingByMentorId(user.getId());
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .graduationYear(user.getGraduationYear())
                .department(user.getDepartment())
                .company(user.getCompany())
                .jobTitle(user.getJobTitle())
                .bio(user.getBio())
                .linkedinUrl(user.getLinkedinUrl())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .resumeUrl(user.getResumeUrl())
                .skills(user.getSkills())
                .availableForMentorship(user.isAvailableForMentorship())
                .isApproved(user.isApproved())
                .createdAt(user.getCreatedAt())
                .averageRating(avgRating)
                .build();
    }

    public UserSummaryDto toSummaryDto(User user) {
        return UserSummaryDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .department(user.getDepartment())
                .company(user.getCompany())
                .jobTitle(user.getJobTitle())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .graduationYear(user.getGraduationYear())
                .availableForMentorship(user.isAvailableForMentorship())
                .build();
    }
}
