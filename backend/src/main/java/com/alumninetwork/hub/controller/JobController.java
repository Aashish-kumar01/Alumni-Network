package com.alumninetwork.hub.controller;

import com.alumninetwork.hub.dto.common.ApiResponse;
import com.alumninetwork.hub.dto.common.PageResponse;
import com.alumninetwork.hub.dto.job.*;
import com.alumninetwork.hub.entity.ApplicationStatus;
import com.alumninetwork.hub.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs", description = "Job postings and applications")
public class JobController {

    private final JobService jobService;

    @GetMapping
    @Operation(summary = "List all jobs with filters")
    public ResponseEntity<PageResponse<JobDto>> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String company,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.getJobs(search, location, company, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job by ID")
    public ResponseEntity<JobDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    @Operation(summary = "Post a new job")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasAnyRole('ALUMNI', 'ADMIN')")
    public ResponseEntity<JobDto> createJob(@Valid @RequestBody CreateJobRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.createJob(request));
    }

    @PostMapping("/{id}/apply")
    @Operation(summary = "Apply for a job")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<JobApplicationDto> applyForJob(
            @PathVariable Long id, @RequestBody ApplyJobRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.applyForJob(id, request));
    }

    @GetMapping("/my-applications")
    @Operation(summary = "Get my job applications")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<PageResponse<JobApplicationDto>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.getMyApplications(page, size));
    }

    @GetMapping("/{id}/applications")
    @Operation(summary = "Get applications for a job")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<PageResponse<JobApplicationDto>> getJobApplications(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(jobService.getJobApplications(id, page, size));
    }

    @PatchMapping("/applications/{applicationId}/status")
    @Operation(summary = "Update application status")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status) {
        jobService.updateApplicationStatus(applicationId, status);
        return ResponseEntity.ok(ApiResponse.ok("Application status updated"));
    }
}
