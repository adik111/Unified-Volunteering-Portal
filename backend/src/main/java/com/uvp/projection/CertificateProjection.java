package com.uvp.projection;

import java.time.LocalDate;

public interface CertificateProjection {
    Integer getCertificateId();
    String getTaskName();     // mapped from task.title
    LocalDate getIssueDate();
    String getQrCode();
    Integer getUserId();
    Integer getTaskId();
}
