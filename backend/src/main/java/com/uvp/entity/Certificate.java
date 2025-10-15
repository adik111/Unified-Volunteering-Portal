package com.uvp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "Certificate")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CertificateId")
    private Integer certificateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TaskId", nullable = false)
    private Task task;

    @Column(name = "IssueDate")
    private LocalDate issueDate;

    @Column(name = "QRCode", columnDefinition = "LONGTEXT")
    private String qrCode; // URL or encoded string

    @Column(name = "Block", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean block; // true if the certificate is blocked, false otherwise
}
