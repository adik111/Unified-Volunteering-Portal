package com.uvp.service;

import com.uvp.entity.Application;
import com.uvp.entity.Task;
import com.uvp.entity.User;
import com.uvp.projection.ApplicationProjection;
import com.uvp.projection.ApplicationTaskProjection;
import com.uvp.projection.PendingApplicationProjection;
import com.uvp.projection.ProofTaskProjection;
import com.uvp.repository.ApplicationRepository;
import com.uvp.repository.TaskRepository;
import com.uvp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepo;
    private final TaskRepository taskRepo;
    private final UserRepository userRepo;

    public boolean applyForTask(Integer userId, Integer taskId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (applicationRepo.existsByTaskAndUser(task, user)) {
            return false;
        }

        Application application = Application.builder()
                .user(user)
                .task(task)
                .status(Application.ApplicationStatus.PENDING)
                .build();

        applicationRepo.save(application);
        return true;
    }

    public List<ProofTaskProjection> getUserApplications(Integer userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return applicationRepo.findTaskSummariesByUser(user);
    }

    public List<ApplicationProjection> getApplications(Integer orgId) {
        return applicationRepo.findByOrganizationId(orgId);
    }

    public List<ApplicationTaskProjection> getApplicationByStatus(Integer userId , String status) {
        Application.ApplicationStatus applicationStatus=Application.ApplicationStatus.valueOf(status.toUpperCase());
        return applicationRepo.findUserAppliedTasks(userId,applicationStatus);
    }

    public String withdrawApplication(Integer applicationId) {
        applicationRepo.deleteById(applicationId);
        return "Deleted Successfully";
    }

    public List<PendingApplicationProjection> getPendingApplication(Integer orgId){
        return applicationRepo.findPendingApplicationsByOrgId(orgId ,Application.ApplicationStatus.PENDING);
    }

    public String updateApplicationStatus(Integer applicationId, String status) {
        Application.ApplicationStatus appStatus=Application.ApplicationStatus.valueOf(status.toUpperCase());
        Application application = applicationRepo.findById(applicationId).orElseThrow();
        application.setStatus(appStatus);
        applicationRepo.save(application);
        return "Successfully Updated";
    }
}
