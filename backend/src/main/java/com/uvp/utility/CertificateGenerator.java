package com.uvp.utility;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class CertificateGenerator {

    public static void createCertificate(String userName, String taskTitle, String filePath, String qrBase64) throws Exception {

        // Single page horizontal certificate design
        String html = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "@page { " +
                "    size: A4 landscape; " +
                "    margin: 0.3in; " +
                "}" +
                "* { " +
                "    box-sizing: border-box; " +
                "}" +
                "body { " +
                "    font-family: 'Georgia', serif; " +
                "    margin: 0; " +
                "    padding: 0; " +
                "    width: 100%; " +
                "    height: 100vh; " +
                "    page-break-inside: avoid; " +
                "}" +
                ".certificate-container { " +
                "    width: 100%; " +
                "    height: 7.5in; " +
                "    background: white; " +
                "    border: 12px solid #2c3e50; " +
                "    border-radius: 15px; " +
                "    position: relative; " +
                "    page-break-inside: avoid; " +
                "    display: flex; " +
                "    flex-direction: column; " +
                "}" +
                ".inner-border { " +
                "    border: 2px solid #f39c12; " +
                "    margin: 15px; " +
                "    padding: 25px; " +
                "    border-radius: 8px; " +
                "    background: linear-gradient(45deg, #f8f9fa 0%, #ffffff 100%); " +
                "    flex: 1; " +
                "    display: flex; " +
                "    flex-direction: column; " +
                "}" +
                ".ornament { " +
                "    position: absolute; " +
                "    width: 45px; " +
                "    height: 45px; " +
                "    background: #f39c12; " +
                "    border-radius: 50%; " +
                "    border: 3px solid #2c3e50; " +
                "}" +
                ".ornament:before { " +
                "    content: '★'; " +
                "    position: absolute; " +
                "    top: 50%; " +
                "    left: 50%; " +
                "    transform: translate(-50%, -50%); " +
                "    font-size: 18px; " +
                "    color: white; " +
                "}" +
                ".ornament.top-left { top: -22px; left: -22px; }" +
                ".ornament.top-right { top: -22px; right: -22px; }" +
                ".ornament.bottom-left { bottom: -22px; left: -22px; }" +
                ".ornament.bottom-right { bottom: -22px; right: -22px; }" +
                ".header { " +
                "    text-align: center; " +
                "    margin-bottom: 20px; " +
                "}" +
                ".certificate-title { " +
                "    font-size: 36px; " +
                "    font-weight: bold; " +
                "    color: #2c3e50; " +
                "    margin: 0; " +
                "    text-shadow: 1px 1px 2px rgba(0,0,0,0.1); " +
                "    letter-spacing: 2px; " +
                "}" +
                ".subtitle { " +
                "    font-size: 16px; " +
                "    color: #7f8c8d; " +
                "    margin: 8px 0 0 0; " +
                "    font-style: italic; " +
                "}" +
                ".content { " +
                "    display: flex; " +
                "    justify-content: space-between; " +
                "    align-items: center; " +
                "    flex: 1; " +
                "    margin: 20px 0; " +
                "}" +
                ".left-content { " +
                "    flex: 2; " +
                "    text-align: center; " +
                "    padding-right: 30px; " +
                "}" +
                ".recipient-name { " +
                "    font-size: 28px; " +
                "    font-weight: bold; " +
                "    color: #2c3e50; " +
                "    margin: 10px 0; " +
                "    text-decoration: underline; " +
                "    text-decoration-color: #f39c12; " +
                "    text-underline-offset: 6px; " +
                "    text-decoration-thickness: 2px; " +
                "}" +
                ".achievement { " +
                "    font-size: 18px; " +
                "    color: #2c3e50; " +
                "    margin: 15px 0; " +
                "    line-height: 1.3; " +
                "}" +
                ".task-title { " +
                "    font-weight: bold; " +
                "    color: #e74c3c; " +
                "    font-style: italic; " +
                "}" +
                ".right-content { " +
                "    flex: 1; " +
                "    text-align: center; " +
                "    max-width: 180px; " +
                "}" +
                ".qr-section { " +
                "    background: #ecf0f1; " +
                "    padding: 15px; " +
                "    border-radius: 10px; " +
                "    border: 1px solid #bdc3c7; " +
                "}" +
                ".qr-title { " +
                "    font-size: 12px; " +
                "    color: #7f8c8d; " +
                "    margin-bottom: 8px; " +
                "}" +
                ".footer { " +
                "    display: flex; " +
                "    justify-content: space-between; " +
                "    align-items: center; " +
                "    margin-top: 15px; " +
                "    padding-top: 15px; " +
                "    border-top: 1px solid #ecf0f1; " +
                "}" +
                ".date { " +
                "    font-size: 14px; " +
                "    color: #7f8c8d; " +
                "}" +
                ".signature-line { " +
                "    text-align: center; " +
                "}" +
                ".signature { " +
                "    width: 150px; " +
                "    border-bottom: 1px solid #2c3e50; " +
                "    margin-bottom: 3px; " +
                "    height: 15px; " +
                "}" +
                ".signature-text { " +
                "    font-size: 12px; " +
                "    color: #7f8c8d; " +
                "}" +
                ".ribbon { " +
                "    position: absolute; " +
                "    top: 15px; " +
                "    right: 15px; " +
                "    background: #e74c3c; " +
                "    color: white; " +
                "    padding: 8px 15px; " +
                "    font-size: 12px; " +
                "    font-weight: bold; " +
                "    transform: rotate(15deg); " +
                "    border-radius: 4px; " +
                "    box-shadow: 0 2px 4px rgba(0,0,0,0.2); " +
                "}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='certificate-container'>" +
                "<div class='ornament top-left'></div>" +
                "<div class='ornament top-right'></div>" +
                "<div class='ornament bottom-left'></div>" +
                "<div class='ornament bottom-right'></div>" +
                "<div class='ribbon'>CERTIFIED</div>" +
                "<div class='inner-border'>" +
                "<div class='header'>" +
                "<h1 class='certificate-title'>CERTIFICATE OF COMPLETION</h1>" +
                "<p class='subtitle'>This certificate is proudly presented to</p>" +
                "</div>" +
                "<div class='content'>" +
                "<div class='left-content'>" +
                "<div class='recipient-name'>" + userName + "</div>" +
                "<div class='achievement'>For successfully completing the task:<br/>" +
                "<span class='task-title'>" + taskTitle + "</span></div>" +
                "</div>" +
                "<div class='right-content'>" +
                "<div class='qr-section'>" +
                "<img src='data:image/png;base64," + qrBase64 + "' width='100' height='100' style='border-radius: 6px;' />" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='footer'>" +
                "<div class='date'>" +
                "<strong>Issued on:</strong><br/>" + java.time.LocalDate.now().toString() +
                "</div>" +
                "<div class='signature-line'>" +
                "<div class='signature'></div>" +
                "<div class='signature-text'>Authorized Signature</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</body></html>";

        try (OutputStream os = new FileOutputStream(filePath)) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, null);
            builder.toStream(os);
            builder.run();
        }
    }
}
