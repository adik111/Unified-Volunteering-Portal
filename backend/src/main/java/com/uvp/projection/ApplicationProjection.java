package com.uvp.projection;

import java.time.LocalDateTime;

public interface ApplicationProjection {
    String getName();
    String getEmail();
    String getPhone();
    String getTaskTitle();
    LocalDateTime getAppliedAt();
    String getStatus();
}
