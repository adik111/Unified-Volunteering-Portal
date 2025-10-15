package com.uvp.projection;

import java.time.LocalDateTime;

public interface SubmissionProjection {
        Integer getId();
        String getTaskTitle();
        LocalDateTime getSubmittedDate();
        String getStatus();
        String getFileType();
        String getFileName();
}
