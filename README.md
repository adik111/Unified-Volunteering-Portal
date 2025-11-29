# 👐 Unified Volunteering Portal (UVP)

A modern full-stack web platform that connects **Volunteers** with **NGOs, Orphanages, and Old-Age Homes** — making community service accessible, transparent, and certificate-driven.

This portal enables organizations to create volunteering opportunities, volunteers to participate and upload proofs, and automatically generates certificates with QR verification.

---

## 🚀 Features

### 👤 Volunteer Module
- Volunteer registration & login  
- View & update profile  
- Browse **open and closed tasks**  
- View detailed task information  
- Apply for tasks  
- Upload proof for completed tasks  
- View submitted proofs  
- Download earned certificates (with QR code)

---

### 🏢 NGO / Organization Module
- Organization registration & login (no admin approval required)  
- Create tasks  
- Manage created tasks  
- View all volunteer applications  
- Verify uploaded submissions  
- Issue certificates  
- Update organization profile  

---

### 🛡️ Admin Module
- Admin login  
- Monitor all volunteers, NGOs, tasks & applications  
- Handle disputes (fake proofs, misuse)  
- Block/remove users or organizations  
- View advanced statistics  

---

## 🧠 Project Workflow

1. Volunteer registers & logs in  
2. NGO/Organization registers & logs in  
3. NGO creates tasks  
4. Volunteer applies  
5. Volunteer uploads proof  
6. NGO verifies  
7. System generates a **certificate with QR code**  
8. Volunteer views/downloads certificate  
9. Admin monitors entire system  

---

## 🏗️ Tech Stack

### 🌐 Frontend
- Next.js 14 (App Router)
- React
- Tailwind CSS
- Axios
- Lucide Icons
- JWT Auth (Local Storage)

### ⚙️ Backend
- Java Spring Boot  
- Spring Web  
- Spring Data JPA  
- MySQL  
- JWT Authentication  
- ZXing (QR Code Generation)  
- iText / PDFBox (Certificate PDF support)  

---

## 🗄️ MySQL Database Structure

Tables used in the UVP system:

- `user`
- `organizationhome`
- `task`
- `application`
- `submission`
- `certificate`

---

## 📁 Project Folder Structure

### 🔹 Frontend (Next.js)
app/
├── auth/
│ ├── login/page.js
│ └── register/page.js
├── volunteer/
│ ├── profile/page.js
│ ├── tasks/page.js
│ ├── submissions/page.js
│ └── certificates/page.js
├── ngo/
│ ├── profile/page.js
│ ├── tasks/page.js
│ ├── create-task/page.js
│ └── applications/page.js
components/
├── Sidebar.js
├── Navbar.js
lib/
└── api.js

shell
Copy code

### 🔹 Backend (Spring Boot)
src/
├── controller/
├── service/
├── repository/
├── entity/
├── config/
└── util/AuthUtil.java

yaml
Copy code

---

## 🧪 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user (Volunteer/NGO) |
| POST | `/auth/login` | Login and receive JWT |

### 👤 Volunteer
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/volunteer/profile` | Get profile |
| GET | `/volunteer/tasks` | Get all tasks |
| POST | `/volunteer/apply/{taskId}` | Apply for a task |
| POST | `/volunteer/submissions` | Upload proof |
| GET | `/volunteer/certificates` | View certificates |

### 🏢 NGO
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ngo/task` | Create task |
| GET | `/ngo/applications/{taskId}` | View volunteer applications |
| POST | `/ngo/verify/{applicationId}` | Verify submission |
| POST | `/ngo/certificate/{taskId}/{userId}` | Issue certificate |

---

## 🖼️ Certificates with QR Code

Each certificate includes:
- Volunteer name  
- Task title  
- Issue date  
- Unique QR code for authenticity  

QR code is generated using **ZXing**.

---

## ⚙️ Backend Setup

```bash
cd UnifiedVolunteeringPortal
mvn clean install
mvn spring-boot:run
Configure MySQL (application.properties)
properties
Copy code
spring.datasource.url=jdbc:mysql://localhost:3306/uvp
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
🖥️ Frontend Setup
bash
Copy code
cd UVP-frontend
npm install
npm run dev
Frontend URL: http://localhost:3000
Backend URL: http://localhost:8080

📜 License
This project is open-source and free to use.

🤝 Contributors
Aditya Kamate (Developer)

ChatGPT Assistance (Architecture + Development Support)
