package com.uvp.controller;


import com.uvp.entity.Submission;
import com.uvp.entity.Task;
import com.uvp.projection.OrganizationSubmissionProjection;
import com.uvp.projection.PendingApplicationProjection;
import com.uvp.projection.SingleSubmissionProjection;
import com.uvp.projection.SubmissionProjection;
import com.uvp.service.ApplicationService;
import com.uvp.service.OrganizationService;
import com.uvp.service.SubmissionService;
import com.uvp.service.TaskService;
import com.uvp.utility.AuthUtil;
import com.uvp.utility.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/organization")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;
    @Autowired
    private final TaskService taskService;
    @Autowired
    private final ApplicationService applicationService;
    private final SubmissionService submissionService;


    @PostMapping("/get")
    public ResponseEntity<?> getOrganization(@RequestHeader("Authorization") String authHeader){
        Integer orgId = AuthUtil.getUserIdByAuthHeader(authHeader);
        return ResponseEntity.ok(organizationService.getOrganizations(orgId));
    }

    @PostMapping("/tasks/{status}")
    public ResponseEntity<?> getTasksByStatusOrgId(@RequestHeader("Authorization") String authHeader,@PathVariable String status ){
        Integer orgId= AuthUtil.getUserIdByAuthHeader(authHeader);
        return ResponseEntity.ok(taskService.getTasksByStatusUserId(orgId,status));
    }

    @PostMapping("/task/create")
    public ResponseEntity<Task> createTask(
            @RequestPart("task") Task task,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            @RequestHeader("Authorization") String authHeader) throws Exception {
        Integer orgId = AuthUtil.getUserIdByAuthHeader(authHeader);

        Task savedTask = taskService.createTask(task, imageFile, orgId);
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }

    @PostMapping("/applications/get")
    public ResponseEntity<?> getApplications(@RequestHeader("Authorization") String authHeader){
        Integer orgId=AuthUtil.getUserIdByAuthHeader(authHeader);
        return ResponseEntity.ok(applicationService.getApplications(orgId));
    }

    @PostMapping("/task/close/{taskId}")
    public ResponseEntity<?> closeTask(@PathVariable Integer taskId) {
        return ResponseEntity.ok(taskService.closeService(taskId));
    }

    @PutMapping("/task/update/{taskId}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Integer taskId,
            @RequestPart("task") Task updatedTask,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws Exception {

        Task savedTask = taskService.updateTask(taskId, updatedTask, imageFile);
        return ResponseEntity.ok(savedTask);
    }

    @PostMapping("/pending/application")
    public ResponseEntity<?> getPendingApplications(@RequestHeader("Authorization") String authHeader){
        Integer orgId=AuthUtil.getUserIdByAuthHeader(authHeader);
        return ResponseEntity.ok(applicationService.getPendingApplication(orgId));
    }

    @PutMapping("/set/{applicationId}/{status}")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Integer applicationId,@PathVariable String status){
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId,status));
    }

    @GetMapping("/submission/approved")
    public ResponseEntity<?> getApprovedSubmissions(@RequestHeader("Authorization") String authHeader) {
        Integer orgId=AuthUtil.getUserIdByAuthHeader(authHeader);
        return ResponseEntity.ok(submissionService.getApprovedSubmissions(orgId));
    }

    @GetMapping("/submission/in-process")
    public ResponseEntity<?> getInProcessSubmissions(@RequestHeader("Authorization") String authHeader) {
        Integer orgId=AuthUtil.getUserIdByAuthHeader(authHeader);
        return ResponseEntity.ok(submissionService.getInProcessSubmissions(orgId));
    }

    @GetMapping("/submission/{id}")
    public ResponseEntity<SingleSubmissionProjection> getSubmission(@PathVariable Integer id) {
        return ResponseEntity.ok(submissionService.getSubmissionById(id));
    }

    @PutMapping("/update-submission/{submissionId}")
    public ResponseEntity<?> updateSubmissionStatus(@PathVariable Integer submissionId) throws Exception {
        return ResponseEntity.ok(submissionService.updateOrgStatus(submissionId));
    }

}
