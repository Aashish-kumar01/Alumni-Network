package com.alumninetwork.hub.service;

import com.alumninetwork.hub.dto.common.PageResponse;
import com.alumninetwork.hub.dto.job.*;
import com.alumninetwork.hub.entity.*;
import com.alumninetwork.hub.exception.BadRequestException;
import com.alumninetwork.hub.exception.ResourceNotFoundException;
import com.alumninetwork.hub.repository.JobApplicationRepository;
import com.alumninetwork.hub.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public JobDto createJob(CreateJobRequest request) {
        User currentUser = userService.getCurrentUser();
        Job job = Job.builder()
                .title(request.getTitle())
                .company(request.getCompany())
                .location(request.getLocation())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .description(request.getDescription())
                .requiredSkills(request.getRequiredSkills() != null ? request.getRequiredSkills() : new java.util.HashSet<>())
                .jobType(request.getJobType())
                .deadline(request.getDeadline())
                .postedBy(currentUser)
                .build();
        return toDto(jobRepository.save(job), currentUser.getId());
    }

    @Transactional(readOnly = true)
    public PageResponse<JobDto> getJobs(String search, String location, String company, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        String searchPattern = search != null ? "%" + search.toLowerCase() + "%" : null;
        String locationPattern = location != null ? "%" + location.toLowerCase() + "%" : null;
        String companyPattern = company != null ? "%" + company.toLowerCase() + "%" : null;
        Page<Job> result = jobRepository.findWithFilters(search, searchPattern, location, locationPattern, company, companyPattern, pageable);

        Long currentUserId = null;
        try { currentUserId = userService.getCurrentUser().getId(); } catch (Exception ignored) {}
        final Long uid = currentUserId;

        List<JobDto> dtos = result.getContent().stream().map(j -> toDto(j, uid)).toList();
        return PageResponse.<JobDto>builder()
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
    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        Long uid = null;
        try { uid = userService.getCurrentUser().getId(); } catch (Exception ignored) {}
        return toDto(job, uid);
    }

    @Transactional
    public JobApplicationDto applyForJob(Long jobId, ApplyJobRequest request) {
        User currentUser = userService.getCurrentUser();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (applicationRepository.existsByJobIdAndApplicantId(jobId, currentUser.getId())) {
            throw new BadRequestException("You have already applied for this job");
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .applicant(currentUser)
                .coverLetter(request.getCoverLetter())
                .resumeUrl(request.getResumeUrl() != null ? request.getResumeUrl() : currentUser.getResumeUrl())
                .build();

        JobApplication saved = applicationRepository.save(application);

        notificationService.createNotification(
                job.getPostedBy().getId(),
                "New Application",
                currentUser.getFullName() + " applied for " + job.getTitle(),
                NotificationType.JOB_APPLICATION,
                jobId
        );

        return toApplicationDto(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<JobApplicationDto> getMyApplications(int page, int size) {
        User user = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<JobApplication> result = applicationRepository.findByApplicantId(user.getId(), pageable);
        List<JobApplicationDto> dtos = result.getContent().stream().map(this::toApplicationDto).toList();
        return PageResponse.<JobApplicationDto>builder().content(dtos).page(result.getNumber()).size(result.getSize())
                .totalElements(result.getTotalElements()).totalPages(result.getTotalPages())
                .first(result.isFirst()).last(result.isLast()).build();
    }

    @Transactional(readOnly = true)
    public PageResponse<JobApplicationDto> getJobApplications(Long jobId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<JobApplication> result = applicationRepository.findByJobId(jobId, pageable);
        List<JobApplicationDto> dtos = result.getContent().stream().map(this::toApplicationDto).toList();
        return PageResponse.<JobApplicationDto>builder().content(dtos).page(result.getNumber()).size(result.getSize())
                .totalElements(result.getTotalElements()).totalPages(result.getTotalPages())
                .first(result.isFirst()).last(result.isLast()).build();
    }

    @Transactional
    public void updateApplicationStatus(Long applicationId, ApplicationStatus status) {
        JobApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("JobApplication", "id", applicationId));
        app.setStatus(status);
        applicationRepository.save(app);

        notificationService.createNotification(
                app.getApplicant().getId(),
                "Application Update",
                "Your application for " + app.getJob().getTitle() + " is now " + status.name().toLowerCase(),
                NotificationType.JOB_APPLICATION,
                app.getJob().getId()
        );
    }

    private JobDto toDto(Job job, Long currentUserId) {
        boolean alreadyApplied = currentUserId != null &&
                applicationRepository.existsByJobIdAndApplicantId(job.getId(), currentUserId);
        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(job.getCompany())
                .location(job.getLocation())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .description(job.getDescription())
                .requiredSkills(job.getRequiredSkills())
                .jobType(job.getJobType())
                .deadline(job.getDeadline())
                .active(job.isActive())
                .postedBy(userService.toSummaryDto(job.getPostedBy()))
                .createdAt(job.getCreatedAt())
                .applicationCount((int) applicationRepository.countByJobId(job.getId()))
                .alreadyApplied(alreadyApplied)
                .build();
    }

    private JobApplicationDto toApplicationDto(JobApplication app) {
        return JobApplicationDto.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .company(app.getJob().getCompany())
                .applicant(userService.toSummaryDto(app.getApplicant()))
                .status(app.getStatus())
                .coverLetter(app.getCoverLetter())
                .resumeUrl(app.getResumeUrl())
                .appliedAt(app.getAppliedAt())
                .build();
    }
}
