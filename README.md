# CampusOrbit — Centralized Multi-College Placement Management System

> **A centralized, multi-tenant placement management platform** connecting **Students**, **Companies**, and each college's **Placement Cell (TPO/Admin)** to manage the complete recruitment lifecycle — with **Super Admin Institutional Verification**, **Student Roll Number + Password authentication (with Email Reset)**, and an aesthetic **White, Royal Blue & Amber Yellow UI**.

---

## 🔑 Authentication Architecture

- **No OTPs for standard login**:
  - **Student Login:** University Roll Number (e.g. `2026-CSE-001`) or Email + Password.
  - **Student Registration:** Select Verified College, Full Name, Email, Phone, Roll Number, Branch, and Create Password.
  - **Forgot / Reset Password via Email:** Students can request a password reset token to their registered email address and reset their password anytime.
  - **Staff / TPO / Recruiter Login:** Official Email + Password.
  - **Super Admin Control Center:** Full master control over colleges, companies, drives, and student records.

---

## 🏛️ Super Admin College Verification Flow

```
College Placement Cell
        ↓
Create College Account & Enter Institutional Details
        ↓
Upload AICTE / UGC Government Verification Document (PDF)
        ↓
Submit request (Status: Pending Super Admin Verification)
        ↓
Super Admin (Master Control Center)
        ↓
Inspect Accreditation PDF Document & Affiliation Number
        ↓
   ┌────┴────┐
   │         │
Approved   Rejected (with custom remarks)
   │
   ↓
Approved College gains full Placement Cell Admin Dashboard (TPO)
```

---

## 🔑 Pre-Configured Test Accounts (1-Click Switcher Available in UI)

| Role | Roll Number / Email | Password | Details |
|---|---|---|---|
| **Student (Active)** | `2026-CSE-001` (or `aarav.sharma@apex.edu`) | `student123` | Aarav Sharma (CSE, CGPA 9.25, in Google Round 2) |
| **Student (Placed)** | `2026-IT-015` (or `sneha.patel@apex.edu`) | `student123` | Sneha Patel (IT, CGPA 8.60, Microsoft 22 LPA Offer) |
| **College TPO** | `tpo.apex@gmail.com` | `tpo123` | Prof. Ramesh Sharma (Apex Institute TPO) |
| **Company Recruiter** | `recruiter@google.com` | `recruiter123` | Marcus Wright (Google Cloud Talent) |
| **Super Admin** | `superadmin@placementcentral.org` | `admin123` | Dr. Elena Vance (Platform Super Admin) |

---

## 🚀 How to Run the Project

1. **Option A (1-Click Launch):** Double click [`start_project.bat`](file:///c:/Users/Neha%20Ghosh/Desktop/final%20year%20project/college_placement_cell/start_project.bat).
2. **Option B (PowerShell):**
   ```powershell
   # Terminal 1 (Django Backend):
   cd backend; python manage.py runserver 127.0.0.1:8000

   # Terminal 2 (React Frontend):
   cd frontend; npm run dev
   ```
3. Open **[http://localhost:5173](http://localhost:5173)** in your browser!
