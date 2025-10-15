package com.uvp.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.uvp.projection.AdminCertificateProjection;
import com.uvp.utility.CertificateGenerator;

import com.uvp.entity.Certificate;
import com.uvp.entity.Task;
import com.uvp.entity.User;
import com.uvp.projection.CertificateProjection;
import com.uvp.repository.CertificateRepository;
import com.uvp.repository.TaskRepository;
import com.uvp.repository.UserRepository;

import org.springframework.core.io.Resource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.io.*;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public boolean issueCertificate(Integer userId, Integer taskId) throws Exception {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // 1. Define file path for certificate PDF
        String fileName = "certificate_" + userId + "_" + taskId + ".pdf";
        String uploadDir = "uploads/certificates/";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        String filePath = uploadDir + fileName;

        // 2. Generate QR code that points to certificate download URL
        // Example URL: http://server/api/certificates/download/{userId}/{taskId}
        String certUrl = "http://192.168.18.12:8080/api/volunteer/certificates/download/" + userId + "/" + taskId;
        String qrBase64 = generateQRCode(certUrl);

        // 3. Create PDF with QR Code embedded
        CertificateGenerator.createCertificate(user.getName(), task.getTitle(), filePath, qrBase64);

        // 4. Save certificate entity (we only store qrBase64 + metadata, not filePath)
        Certificate cert = Certificate.builder()
                .user(user)
                .task(task)
                .issueDate(LocalDate.now())
                .qrCode(qrBase64) // base64 QR image (frontend can render it)
                .build();

        certificateRepository.save(cert);
        return true;
    }

    public List<CertificateProjection> getCertificatesByUser(Integer userId) {
        return certificateRepository.findCertificatesByUserId(userId);
    }

    public Resource downloadCertificate(Integer userId, Integer taskId) throws IOException {
        String filePath = "uploads/certificates/certificate_" + userId + "_" + taskId + ".pdf";
        File file = new File(filePath);

        if (!file.exists()) {
            throw new RuntimeException("Certificate not found for userId=" + userId + ", taskId=" + taskId);
        }

        return new InputStreamResource(new FileInputStream(file));
    }


    // 🔹 QR Code generator (Base64 string for storing in DB)
    private String generateQRCode(String text) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 200, 200);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", baos);

        return Base64.getEncoder().encodeToString(baos.toByteArray());
    }


    public List<AdminCertificateProjection> getAllCertificates() {
        return certificateRepository.findAdminCertificates();
    }

    public String toggleBlockStatus(Integer certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found with ID: " + certificateId));

        certificate.setBlock(!certificate.isBlock()); // flip the boolean
        certificateRepository.save(certificate);
        return "Changes applied succesfully";
    }




}

