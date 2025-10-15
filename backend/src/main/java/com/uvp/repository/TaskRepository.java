package com.uvp.repository;

import com.uvp.entity.OrganizationHome;
import com.uvp.entity.Task;
import com.uvp.projection.TaskProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<TaskProjection> findByStatusOrderByCreatedAtDesc(Task.TaskStatus status);
    List<TaskProjection> findByOrganizationHomeOrgIdAndStatusOrderByCreatedAtDesc(Integer orgId, Task.TaskStatus status);


    List<Task> findByOrganizationHomeOrgId(Integer orgId);

    Long countByStatus(Task.TaskStatus taskStatus);
}

