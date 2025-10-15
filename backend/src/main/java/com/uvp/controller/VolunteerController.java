package com.uvp.controller;

import com.uvp.entity.Application;
import com.uvp.entity.Certificate;
import com.uvp.entity.Submission;
import com.uvp.entity.User;
import com.uvp.projection.CertificateProjection;
import com.uvp.service.*;
import com.uvp.utility.AuthUtil;
import com.uvp.utility.JwtUtil;
import org.springframework.core.io.Resource;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/volunteer")
@RequiredArgsConstructor
public class VolunteerController {

    private final ApplicationService applicationService;
    private final SubmissionService submissionService;
    private final CertificateService certificateService;
    private final TaskService taskService;
    private final VolunteerService volunteerService;


    @PostMapping("/profile")
    public ResponseEntity<?> profile(@RequestHeader("Authorization") String authHeader){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        String token = authHeader.substring(7); // Remove "Bearer "
        if (!JwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        return ResponseEntity.ok(volunteerService.getProfile(token));
    }

    @PostMapping("/profile/edit")
    public ResponseEntity<?> profileEdit(@RequestHeader("Authorization") String authHeader,@RequestBody User user){
        int userId=AuthUtil.getUserIdByAuthHeader(authHeader);
        if(userId==0){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token or Token Expired");
        }
        return ResponseEntity.ok(volunteerService.userProfileUpdate(userId,user));

    }


    @PostMapping("/tasks/{status}")
    public ResponseEntity<?> tasks(@PathVariable String status){
        return ResponseEntity.ok(taskService.getTasksByStatus(status));
    }

    @PostMapping("/task/{taskId}")
    public ResponseEntity<?> task(@PathVariable Integer taskId){
        return ResponseEntity.ok(taskService.getTask(taskId));
    }

    // Apply for a task
    @PostMapping("/{taskId}/apply")
    public ResponseEntity<?> apply(@PathVariable Integer taskId,@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        String token = authHeader.substring(7); // Remove "Bearer "
        if (!JwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        int userId = JwtUtil.extractUserId(token);

        if(applicationService.applyForTask(userId, taskId)){
        return ResponseEntity.ok("Applied Successfully");
        }else{
            return ResponseEntity.status(409).body("Already Applied");
        }
    }

    // Get user’s applications
    @PostMapping("/applications")
    public ResponseEntity<?> getApplications(@RequestHeader("Authorization") String authHeader) {

        int userId = AuthUtil.getUserIdByAuthHeader(authHeader);

        return ResponseEntity.ok(applicationService.getUserApplications(userId));
    }

    // Upload proof
    @PostMapping("/submit")
    public ResponseEntity<?> uploadSubmission(
            @RequestParam("applicationId") Integer applicationId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            Submission submission = submissionService.submitProof(applicationId, file);
            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading submission: " + e.getMessage());
        }
    }

    @PostMapping("/submissions")
    public ResponseEntity<?> getSubmissions(@RequestHeader("Authorization") String authHeader){
        int userId=AuthUtil.getUserIdByAuthHeader(authHeader);
        if(userId==0){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token or Token Expired");
        }
        return ResponseEntity.ok(submissionService.getSubmissions(userId));
    }


    @PostMapping("/get/applications/{status}")
    public ResponseEntity<?> getApplicationByStatus(@RequestHeader("Authorization") String authHeader,@PathVariable String status){
        Integer userId=AuthUtil.getUserIdByAuthHeader(authHeader);
        return ResponseEntity.ok(applicationService.getApplicationByStatus(userId,status));
    }

    @DeleteMapping("/application/withdraw/{applicationId}")
    public ResponseEntity<?> withdrawApplication(@PathVariable Integer applicationId){
        return ResponseEntity.ok(applicationService.withdrawApplication(applicationId));

    }

    @GetMapping("/certification")
    public ResponseEntity<List<CertificateProjection>> getCertificatesByUser(@RequestHeader("Authorization") String authHeader) {
        Integer userId=AuthUtil.getUserIdByAuthHeader(authHeader);
        return ResponseEntity.ok(certificateService.getCertificatesByUser(userId));
    }

    @GetMapping("/certificates/download/{userId}/{taskId}")
    public ResponseEntity<Resource> downloadCertificate(
            @PathVariable Integer userId,
            @PathVariable Integer taskId) throws IOException {

        Resource resource = certificateService.downloadCertificate(userId, taskId);

        String fileName = "certificate_" + userId + "_" + taskId + ".pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + fileName)
                .body(resource);
    }

}

