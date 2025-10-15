package com.uvp.projection;

import java.time.LocalDate;

public interface ApplicationTaskProjection {
    Integer getTaskId();
    String getTitle();
    LocalDate getStartDate();
    LocalDate getEndDate();
    String getStatus();
    String getImage();
    Integer getApplicationId();
}
