package com.uvp.service;

import com.uvp.entity.Task;
import com.uvp.repository.OrganizationHomeRepository;
import com.uvp.repository.TaskRepository;
import com.uvp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrganizationHomeRepository organizationRepository;
    @Autowired
    private TaskRepository taskRepository;


    public Map<String, Long> getDashboardStats() {
    Map<String, Long> stats = new HashMap<>();
    stats.put("totalUsers", userRepository.count());
    stats.put("totalOrganizations", organizationRepository.count());
    stats.put("totalTasks", taskRepository.count());
    stats.put("closedTasks", taskRepository.countByStatus(Task.TaskStatus.CLOSED));
    stats.put("completedTasks", taskRepository.countByStatus(Task.TaskStatus.COMPLETED));
    return stats;
}

}
