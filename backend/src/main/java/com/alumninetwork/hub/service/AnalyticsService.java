package com.alumninetwork.hub.service;

import com.alumninetwork.hub.dto.analytics.AnalyticsDto;
import com.alumninetwork.hub.entity.Role;
import com.alumninetwork.hub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final EventRepository eventRepository;
    private final MentorshipRequestRepository mentorshipRepository;
    private final DonationRepository donationRepository;

    public AnalyticsDto getAnalytics() {
        return AnalyticsDto.builder()
                .totalUsers(userRepository.count())
                .totalAlumni(userRepository.countByRole(Role.ALUMNI))
                .totalStudents(userRepository.countByRole(Role.STUDENT))
                .totalJobs(jobRepository.countByActiveTrue())
                .totalEvents(eventRepository.count())
                .totalMentorshipRequests(mentorshipRepository.count())
                .totalDonations(donationRepository.count())
                .totalDonationAmount(donationRepository.sumTotalDonations())
                .build();
    }
}
