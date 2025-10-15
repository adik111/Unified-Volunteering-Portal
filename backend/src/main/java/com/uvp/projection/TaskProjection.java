package com.uvp.projection;

import com.uvp.entity.Task.TaskStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public interface TaskProjection {
    Integer getTaskId();
    String getTitle();
    TaskStatus getStatus();
    Integer getCapacity();
    LocalDate getStartDate();
    LocalDate getEndDate();
    String getImages();
    LocalDateTime getCreatedAt();

    default String getImageUrl() {
        if (getImages() == null) return null;
        return "http://localhost:8080/" + getImages().replace("\\", "/");
    }
}
