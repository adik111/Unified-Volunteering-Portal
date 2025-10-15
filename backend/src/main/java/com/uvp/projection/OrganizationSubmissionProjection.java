package com.uvp.projection;

import java.time.LocalDateTime;

public interface OrganizationSubmissionProjection {
    Integer getSubmissionId();
    String getUserName();
    String getTaskName();
    LocalDateTime getSubmittedAt();
    String getStatus();
}
