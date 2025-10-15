package com.uvp.service;

import com.uvp.entity.Application;
import com.uvp.entity.Submission;
import com.uvp.entity.User;
import com.uvp.projection.OrganizationSubmissionProjection;
import com.uvp.projection.SingleSubmissionProjection;
import com.uvp.projection.SubmissionProjection;
import com.uvp.repository.ApplicationRepository;
import com.uvp.repository.CertificateRepository;
import com.uvp.repository.SubmissionRepository;
import com.uvp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    @Autowired
    private final SubmissionRepository submissionRepo;
    private final ApplicationRepository applicationRepo;
    private final UserRepository userRepository;
    private final CertificateService certificateService;
    private final CertificateRepository certificate;

    public Submission submitProof(Integer applicationId, MultipartFile file) throws IOException {
        // Fetch application
        Application application = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Create upload folder if not exists
        String uploadDir = "uploads/submissions/";

        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        // Store file in server folder
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filepath = Paths.get(uploadDir, filename);
        Files.write(filepath, file.getBytes());

        // Save only path in DB
        Submission submission = Submission.builder()
                .application(application)
                .proofFile(filepath.toString()) // save path, not file
                .build();

        return submissionRepo.save(submission);
    }

    public List<SubmissionProjection> getSubmissions(int userId) {

        return submissionRepo.findUserSubmissions(userId);
    }

    public List<OrganizationSubmissionProjection> getApprovedSubmissions(Integer orgId) {
        return submissionRepo.findApprovedSubmissions(orgId);
    }

    public List<OrganizationSubmissionProjection> getInProcessSubmissions(Integer orgId) {
        return submissionRepo.findInProcessSubmissions(orgId);
    }

    public SingleSubmissionProjection getSubmissionById(Integer id) {
        return submissionRepo.findSubmissionDetailById(id);

    }

    public String updateOrgStatus(Integer submissionId) throws Exception {
        Submission submission=submissionRepo.findById(submissionId).orElseThrow();
        submission.setVerifiedByOrg(true);
        submissionRepo.save(submission);
        Integer userId=submission.getApplication().getUser().getUserId();
        Integer taskId=submission.getApplication().getTask().getTaskId();
        boolean orgStatus=submission.getVerifiedByOrg();
        boolean adminStatus=submission.getVerifiedByAdmin();
        boolean status=false;
        if(adminStatus){
            status = certificateService.issueCertificate(userId, taskId);
        }
        return "Updated Successfully with status "+status;
    }

    public List<OrganizationSubmissionProjection> getAdminApprovedSubmissions() {
        return submissionRepo.findByVerifiedByAdmin();
    }

    public List<OrganizationSubmissionProjection> getAdminPendingSubmissions() {
        return submissionRepo.findByNotVerifiedByAdmin();
    }

    public SingleSubmissionProjection getAdminSubmissionById(Integer id) {
        return submissionRepo.findAdminSubmissionDetailById(id);

    }

    public String updateAdminStatus(Integer submissionId) throws Exception {
        Submission submission=submissionRepo.findById(submissionId).orElseThrow();
        submission.setVerifiedByAdmin(true);
        submissionRepo.save(submission);
        Integer userId=submission.getApplication().getUser().getUserId();
        Integer taskId=submission.getApplication().getTask().getTaskId();
        boolean orgStatus=submission.getVerifiedByOrg();
        boolean status=false;
        if(orgStatus){
            status = certificateService.issueCertificate(userId, taskId);
        }
        return "Updated Successfully with status "+status;
    }
}
