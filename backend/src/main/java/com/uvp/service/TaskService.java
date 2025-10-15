package com.uvp.service;

import com.uvp.entity.OrganizationHome;
import com.uvp.entity.Task;
import com.uvp.entity.User;
import com.uvp.projection.ProofTaskProjection;
import com.uvp.projection.TaskProjection;
import com.uvp.repository.ApplicationRepository;
import com.uvp.repository.OrganizationHomeRepository;
import com.uvp.repository.TaskRepository;
import com.uvp.repository.UserRepository;
import com.uvp.utility.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    private UserRepository userRepository;
    private ApplicationRepository applicationRepository;
    @Autowired
    private OrganizationHomeRepository organizationHomeRepository;

    public Task getTask(int taskId){
        Task task=taskRepository.findById(taskId).orElse(null);

        if (task != null && task.getImages() != null) {
            String baseUrl = "http://localhost:8080/"; // you can also move this to application.properties
            task.setImages(baseUrl + task.getImages().replace("\\", "/"));
        }
        return task;
    }


    public List<TaskProjection> getTasksByStatus(String status) {
        Task.TaskStatus taskStatus = Task.TaskStatus.valueOf(status.toUpperCase());
        return taskRepository.findByStatusOrderByCreatedAtDesc(taskStatus);
    }


    public List<TaskProjection> getTasksByStatusUserId(Integer orgId,String status)  {
        Task.TaskStatus taskStatus=Task.TaskStatus.valueOf((status.toUpperCase()));
//        OrganizationHome org=organizationHomeRepository.findById(orgId).orElseThrow();
        return taskRepository.findByOrganizationHomeOrgIdAndStatusOrderByCreatedAtDesc(orgId,taskStatus);
    }

    public Task createTask(Task task, MultipartFile imageFile, Integer orgId) throws IOException{
        OrganizationHome org = organizationHomeRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found with ID: " + orgId));
        task.setOrganizationHome(org);

        // Create upload folder if not exists
        String uploadDir = "uploads/tasks/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        // Save file on server and store path in Task entity
        if (imageFile != null && !imageFile.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path filepath = Paths.get(uploadDir, filename);
            Files.write(filepath, imageFile.getBytes());
            task.setImages(filepath.toString().replace("\\", "/"));
        }

        // Save Task
        return taskRepository.save(task);
    }

    public String closeService(Integer taskId) {
        Task task=taskRepository.findById(taskId).orElseThrow();
        task.setStatus(Task.TaskStatus.CLOSED);
        taskRepository.save(task);
        return "Successfully closed";
    }


    public Task updateTask(Integer taskId, Task updatedTask, MultipartFile newImage) throws IOException {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));


        // ✅ Update all fields (overwrite directly)
        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setCapacity(updatedTask.getCapacity());
        existingTask.setStartDate(updatedTask.getStartDate());
        existingTask.setEndDate(updatedTask.getEndDate());
        existingTask.setLocationLink(updatedTask.getLocationLink());

        // ✅ Handle image update
        if (newImage != null && !newImage.isEmpty()) {
            // Delete old image if exists
            if (existingTask.getImages() != null) {
                File oldFile = new File(existingTask.getImages());
                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }

            // Save new image
            String uploadDir = "uploads/tasks/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String filename = System.currentTimeMillis() + "_" + newImage.getOriginalFilename();
            Path filepath = Paths.get(uploadDir, filename);
            Files.write(filepath, newImage.getBytes());

            existingTask.setImages(filepath.toString().replace("\\", "/"));
        }

        // ✅ Save updated task
        return taskRepository.save(existingTask);
    }

    public List<Task> getTasksByOrg(Integer orgId) {
        return taskRepository.findByOrganizationHomeOrgId(orgId);
    }

}
