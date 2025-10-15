package com.uvp.repository;

import com.uvp.entity.Application;
import com.uvp.entity.Task;
import com.uvp.entity.User;
import com.uvp.projection.ApplicationProjection;
import com.uvp.projection.ApplicationTaskProjection;
import com.uvp.projection.PendingApplicationProjection;
import com.uvp.projection.ProofTaskProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    List<Application> findByUser(User user);


    @Query("""
    SELECT t.title AS title, a.applicationId AS applicationId
    FROM Application a
    JOIN a.task t
    WHERE a.user = :user
      AND NOT EXISTS (
          SELECT 1 FROM Submission s
          WHERE s.application = a
      )
    """)
    List<ProofTaskProjection> findTaskSummariesByUser(@Param("user") User user);


    List<Application> findByTask(Task task);
    boolean existsByTaskAndUser(Task task, User user);

    @Query("SELECT u.name AS name, u.email AS email, u.phone AS phone, " +
            "t.title AS taskTitle, a.appliedAt AS appliedAt, a.status AS status " +
            "FROM Application a " +
            "JOIN a.task t " +
            "JOIN t.organizationHome o " +
            "JOIN a.user u " +
            "WHERE o.orgId = :orgId")
    List<ApplicationProjection> findByOrganizationId(@Param("orgId") Integer orgId);

    @Query("SELECT a.task.taskId as taskId, " +
            "a.task.title as title, " +
            "a.task.startDate as startDate, " +
            "a.task.endDate as endDate, " +
            "CONCAT('http://localhost:8080/', a.task.images) as image, " +
            "a.status as status, "+
            "a.applicationId as applicationId "+
            "FROM Application a " +
            "WHERE a.user.userId = :userId AND a.status = :status")
    List<ApplicationTaskProjection> findUserAppliedTasks(
            @Param("userId") Integer userId,
            @Param("status") Application.ApplicationStatus status
    );

    @Query("""
           SELECT a.applicationId AS applicationId,
                  t.taskId AS taskId,
                  t.title AS taskName,
                  u.email AS email,
                  a.appliedAt AS appliedAt,
                  u.name as name
           FROM Application a
           JOIN a.task t
           JOIN a.user u
           WHERE t.organizationHome.orgId = :orgId
             AND a.status = :status
           ORDER BY a.appliedAt DESC
           """)
    List<PendingApplicationProjection> findPendingApplicationsByOrgId(
            @Param("orgId") Integer orgId,
            @Param("status") Application.ApplicationStatus status
    );
}
