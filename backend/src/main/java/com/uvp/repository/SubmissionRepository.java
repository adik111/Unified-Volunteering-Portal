package com.uvp.repository;

import com.uvp.entity.Application;
import com.uvp.entity.Submission;
import com.uvp.entity.User;
import com.uvp.projection.OrganizationSubmissionProjection;
import com.uvp.projection.SingleSubmissionProjection;
import com.uvp.projection.SubmissionProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Integer> {
    List<Submission> findByApplication(Application application);

    @Query("""
    SELECT s.submissionId AS id,
           t.title AS taskTitle,
           s.submittedAt AS submittedDate,
           CASE 
               WHEN s.verifiedByAdmin = true THEN 'Approved'
               WHEN s.verifiedByOrg = true THEN 'Pending Admin'
               ELSE 'Pending'
           END AS status,
           FUNCTION('REPLACE', s.proofFile, 'uploads\\submissions\\', '') AS fileName
    FROM Submission s
    JOIN s.application a
    JOIN a.task t
    WHERE a.user.userId = :userId
""")
    List<SubmissionProjection> findUserSubmissions(@Param("userId") Integer userId);

    @Query("""
           SELECT s.submissionId AS submissionId,
                  u.name AS userName,
                  t.title AS taskName,
                  s.submittedAt AS submittedAt,
                  CASE 
                      WHEN s.verifiedByOrg = true THEN 'APPROVED'
                      ELSE 'UNDER_REVIEW'
                  END AS status
           FROM Submission s
           JOIN s.application a
           JOIN a.user u
           JOIN a.task t
           WHERE s.verifiedByOrg = true AND t.organizationHome.orgId= :orgId
           ORDER BY s.submittedAt DESC
           """)
    List<OrganizationSubmissionProjection> findApprovedSubmissions(@Param("orgId") Integer orgId);

    @Query("""
           SELECT s.submissionId AS submissionId,
                  u.name AS userName,
                  t.title AS taskName,
                  s.submittedAt AS submittedAt,
                  CASE
                      WHEN s.verifiedByOrg = true THEN 'APPROVED'
                      ELSE 'UNDER_REVIEW'
                  END AS status
           FROM Submission s
           JOIN s.application a
           JOIN a.user u
           JOIN a.task t
           WHERE s.verifiedByOrg = false AND t.organizationHome.orgId= :orgId
           ORDER BY s.submittedAt DESC
           """)
    List<OrganizationSubmissionProjection> findInProcessSubmissions(@Param("orgId") Integer orgId);

    @Query("""
       SELECT s.submissionId AS submissionId,
              t.title AS taskTitle,
              u.name AS volunteerName,
              u.email AS volunteerEmail,
              u.phone AS volunteerPhone,
              s.proofFile AS proofFile,
              s.submittedAt AS submittedAt,
              CASE
                  WHEN s.verifiedByOrg = true THEN 'APPROVED'
                  ELSE 'UNDER_REVIEW'
              END AS status
       FROM Submission s
       JOIN s.application a
       JOIN a.user u
       JOIN a.task t
       WHERE s.submissionId = :submissionId
       """)
    SingleSubmissionProjection findSubmissionDetailById(@Param("submissionId") Integer submissionId);

    @Query("""
           SELECT s.submissionId AS submissionId,
                  u.name AS userName,
                  t.title AS taskName,
                  s.submittedAt AS submittedAt,
                  CASE 
                      WHEN s.verifiedByAdmin = true THEN 'APPROVED'
                      ELSE 'UNDER_REVIEW'
                  END AS status
           FROM Submission s
           JOIN s.application a
           JOIN a.user u
           JOIN a.task t
           WHERE s.verifiedByAdmin = true 
           ORDER BY s.submittedAt
           """)
    List<OrganizationSubmissionProjection> findByVerifiedByAdmin();

    @Query("""
           SELECT s.submissionId AS submissionId,
                  u.name AS userName,
                  t.title AS taskName,
                  s.submittedAt AS submittedAt,
                  CASE
                      WHEN s.verifiedByAdmin = true THEN 'APPROVED'
                      ELSE 'UNDER_REVIEW'
                  END AS status
           FROM Submission s
           JOIN s.application a
           JOIN a.user u
           JOIN a.task t
           WHERE s.verifiedByAdmin = false
           ORDER BY s.submittedAt 
           """)
    List<OrganizationSubmissionProjection> findByNotVerifiedByAdmin();

    @Query("""
       SELECT s.submissionId AS submissionId,
              t.title AS taskTitle,
              u.name AS volunteerName,
              u.email AS volunteerEmail,
              u.phone AS volunteerPhone,
              s.proofFile AS proofFile,
              s.submittedAt AS submittedAt,
              CASE
                  WHEN s.verifiedByAdmin = true THEN 'APPROVED'
                  ELSE 'UNDER_REVIEW'
              END AS status
       FROM Submission s
       JOIN s.application a
       JOIN a.user u
       JOIN a.task t
       WHERE s.submissionId = :submissionId
       """)
    SingleSubmissionProjection findAdminSubmissionDetailById(@Param("submissionId") Integer id);
}
