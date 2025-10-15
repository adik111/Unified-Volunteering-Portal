package com.uvp.projection;

import java.time.LocalDate;

public interface AdminCertificateProjection {
    Integer getCertificateId();
    String getTaskName();     // mapped from task.title
    LocalDate getIssueDate();
    Integer getUserId();
    String getUserName();
    Integer getTaskId();
    Boolean getBlock();
}
