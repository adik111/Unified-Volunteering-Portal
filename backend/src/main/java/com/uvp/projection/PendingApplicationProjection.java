package com.uvp.projection;

import java.time.LocalDateTime;

public interface PendingApplicationProjection {
    Integer getApplicationId();
    Integer getTaskId();
    String getTaskName();
    String getEmail();
    LocalDateTime getAppliedAt();
    String getName();
}
