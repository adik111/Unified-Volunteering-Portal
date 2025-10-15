package com.uvp.repository;

import com.uvp.entity.Certificate;
import com.uvp.entity.User;
import com.uvp.projection.AdminCertificateProjection;
import com.uvp.projection.CertificateProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Integer> {
    List<Certificate> findByUser(User user);

    @Query("SELECT c.certificateId as certificateId, " +
            "t.title as taskName, " +
            "c.issueDate as issueDate, " +
            "c.qrCode as qrCode, " +
            "c.user.userId as userId, "+
            "t.taskId as taskId "+
            "FROM Certificate c " +
            "JOIN c.task t " +
            "WHERE c.user.userId = :userId "+
            "AND c.block = false")
    List<CertificateProjection> findCertificatesByUserId(Integer userId);

    List<Certificate> findByTask_TaskId(Integer taskId);

    @Query("SELECT c.certificateId AS certificateId, " +
            "t.title AS taskName, " +
            "u.name AS userName, " +
            "c.issueDate AS issueDate, " +
            "u.userId AS userId, " +
            "t.taskId AS taskId, " +
            "c.block AS block "+
            "FROM Certificate c " +
            "JOIN c.task t " +
            "JOIN c.user u")
    List<AdminCertificateProjection> findAdminCertificates();

}