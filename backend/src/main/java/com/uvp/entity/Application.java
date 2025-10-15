package com.uvp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Application")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ApplicationId")
    private Integer applicationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TaskId", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(name = "AppliedAt")
    private LocalDateTime appliedAt;

    @PrePersist
    public void prePersist() {
        if (this.appliedAt == null) this.appliedAt = LocalDateTime.now();
        if (this.status == null) this.status = ApplicationStatus.PENDING;
    }

    public enum ApplicationStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}
