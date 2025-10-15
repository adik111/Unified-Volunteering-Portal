package com.uvp.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "Task")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TaskId")
    private Integer taskId;

    // FK to OrganizationHome.OrgId
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OrgId", nullable = false)
    private OrganizationHome organizationHome;

    @Column(name = "Title", nullable = false)
    private String title;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
//    @JsonSetter(nulls = Nulls.SKIP)
    @Column(name = "Status", nullable = false)
    private TaskStatus status = TaskStatus.OPEN;

    @Column(name = "Capacity", nullable = false)
    private Integer capacity;

    @Column(name = "StartDate")
    private LocalDate startDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @Column(name = "LocationLink")
    private String locationLink;

    @Column(name = "Images")
    private String images; // comma-separated URLs or paths

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = TaskStatus.OPEN;
    }

    public enum TaskStatus {
        OPEN,
        CLOSED,
        COMPLETED,
        VERIFIED
    }
}
