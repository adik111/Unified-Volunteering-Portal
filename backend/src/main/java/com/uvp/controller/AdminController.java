package com.uvp.controller;

import com.uvp.entity.*;
import com.uvp.projection.OrganizationSubmissionProjection;
import com.uvp.projection.SingleSubmissionProjection;
import com.uvp.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    @Autowired
    private final VolunteerService volunteerService;
    private final TaskService taskService;
    private final OrganizationService organizationService;
    private final SubmissionService submissionService;
    private final CertificateService certificateService;
    private final AdminService adminService;



    // 1. All Users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return volunteerService.getAllUsers();
    }

    // 2. Organizations (all or by type)
    @GetMapping("/organizations")
    public List<OrganizationHome> getOrganizations(@RequestParam(required = false) String type) {
        return organizationService.getOrganizationsByType(type);
    }

    // 3. Organization by Id
    @GetMapping("/organizations/{orgId}")
    public OrganizationHome getOrganizationById(@PathVariable Integer orgId) {
        return organizationService.getOrganizationById(orgId);
    }

    // 4. Tasks by Org
    @GetMapping("/tasks/{orgId}")
    public List<Task> getTasksByOrg(@PathVariable Integer orgId) {
        return taskService.getTasksByOrg(orgId);
    }

    // 5. Submissions
    @GetMapping("/submissions/approved")
    public ResponseEntity<?> getApprovedSubmissions() {
        return ResponseEntity.ok(submissionService.getAdminApprovedSubmissions());
    }

    @GetMapping("/submissions/pending")
    public ResponseEntity<?> getPendingSubmissions() {
        return ResponseEntity.ok(submissionService.getAdminPendingSubmissions());
    }

    // 6. Dashboard Stats
    @GetMapping("/stats")
    public Map<String, Long> getDashboardStats() {
        return adminService.getDashboardStats();
    }

    // 7. All Certificates
    @GetMapping("/certificates")
    public ResponseEntity<?> getAllCertificates() {
        return ResponseEntity.ok(certificateService.getAllCertificates());
    }

    @GetMapping("/submission/{id}")
    public ResponseEntity<SingleSubmissionProjection> getSubmission(@PathVariable Integer id) {
        return ResponseEntity.ok(submissionService.getAdminSubmissionById(id));
    }

    @PutMapping("/update-submission/{submissionId}")
    public ResponseEntity<?> updateAdminSubmissionStatus(@PathVariable Integer submissionId) throws Exception {
        return ResponseEntity.ok(submissionService.updateAdminStatus(submissionId));
    }

    @PutMapping("/update-block-status/{certificationId}")
    public ResponseEntity<?> toggleBlockStatus(@PathVariable Integer certificationId)  {
        return ResponseEntity.ok(certificateService.toggleBlockStatus(certificationId));
    }


}
