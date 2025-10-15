package com.uvp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Submission")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SubmissionId")
    private Integer submissionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApplicationId", nullable = false)
    private Application application;

    @Column(name = "ProofFile")
    private String proofFile; // file path or URL

    @Column(name = "SubmittedAt")
    private LocalDateTime submittedAt;

    @Column(name = "VerifiedByOrg")
    private Boolean verifiedByOrg = false;

    @Column(name = "VerifiedByAdmin")
    private Boolean verifiedByAdmin = false;

    @PrePersist
    public void prePersist() {
        if (this.submittedAt == null) this.submittedAt = LocalDateTime.now();
        if (this.verifiedByOrg == null) this.verifiedByOrg = false;
        if (this.verifiedByAdmin == null) this.verifiedByAdmin = false;
    }
}
