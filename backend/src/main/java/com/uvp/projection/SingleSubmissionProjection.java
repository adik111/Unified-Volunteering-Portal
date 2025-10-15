package com.uvp.projection;

import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;

public interface SingleSubmissionProjection {
    Integer getSubmissionId();
    String getTaskTitle();
    String getVolunteerName();
    String getVolunteerEmail();
    String getVolunteerPhone();
    String getProofFile();
    LocalDateTime getSubmittedAt();
    String getStatus();

    default String getProofFileUrl() {
        if (getProofFile() == null) return null;
        return "http://localhost:8080/" + getProofFile().replace("\\", "/");
    }
}
