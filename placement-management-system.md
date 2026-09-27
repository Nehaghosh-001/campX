# Centralized Multi-College Placement Management System

## 1. One-Line Pitch
A centralized placement management platform that any college can onboard onto, connecting **Students**, **Companies**, and each college's own **Placement Cell (TPO/Admin)** to manage the complete recruitment lifecycle — from company registration to final selection — with phone + email OTP-based login (no passwords).

## 2. Problem Statement
Most colleges manage placements manually (Excel sheets, WhatsApp groups, email chains). This causes:
- No centralized eligibility filtering (CGPA, backlogs, branch, skills).
- No structured round-wise tracking (Aptitude → Technical → HR).
- No official, verifiable notification system.
- No historical placement record for the college or for individual students.
- Placement cells have no dashboard/control over the process.

LinkedIn and generic job boards are **not built for this** — they don't understand a college's internal eligibility rules, round structure, or verification needs.

## 3. Why This Is Different From LinkedIn

| LinkedIn | This Platform |
|---|---|
| General job platform | Only for onboarded colleges |
| Students find jobs themselves | Placement cell manages the process |
| Companies post jobs publicly | College verifies/approves companies |
| No eligibility workflow | Automatic eligibility filtering per college criteria |
| Student applies directly | Admin/TPO controls registration & flow |
| No round tracking | Aptitude → Technical → HR tracking per company |
| Generic notifications | Official college placement notifications |
| No centralized records | Full placement history per student & per college |
| No TPO control | Dedicated TPO/Admin dashboard |

## 4. Core Workflow

```
College Onboards → TPO/Admin Account Created
        ↓
Company Registers / Is Added → Verified by TPO
        ↓
Company Posts Drive (eligibility: CGPA, branch, backlogs, skills)
        ↓
System Auto-Filters Eligible Students → Notifies Them
        ↓
Students Register/Apply for the Drive
        ↓
TPO Conducts Rounds: Aptitude → Technical → HR
        ↓
Results Recorded Round-by-Round
        ↓
Final Selection List Published
        ↓
Placement Record Stored (Student Profile + College Records)
```

## 5. User Roles

### A. Super Admin (Platform Owner)
- Approves new colleges onboarding onto the platform.
- Manages platform-level analytics (colleges, students, companies, placements across all colleges).

### B. College Admin / TPO (per college)
- Verifies/approves companies for their college.
- Creates placement drives with eligibility criteria.
- Views auto-filtered eligible student list.
- Manages round-wise scheduling and results.
- Publishes final selection list.
- Views/exports placement statistics and records.

### C. Company (Recruiter)
- Registers, gets verified by a college's TPO (or platform).
- Posts drives with job description + eligibility criteria.
- Views shortlisted/eligible applicants.
- Updates round results (or TPO does this on their behalf).

### D. Student
- Registers via phone number + email (OTP-based, no password).
- Fills profile: college, branch, CGPA, backlog status, skills, resume.
- Gets notified automatically when eligible for a drive.
- Applies/confirms participation.
- Tracks own status through rounds.
- Views personal placement history.

## 6. Authentication (No Password Model)
- **Signup/Login:** Phone number (OTP via SMS) + Email (OTP via email) — both must be verified.
- No password stored or required at any point.
- Session handled via JWT (`djangorestframework-simplejwt`) after successful dual-OTP verification.
- Rate-limit OTP requests (e.g., max 5/hour) to prevent abuse.
- OTP expiry: 5–10 minutes, single-use, hashed in DB (never stored plain).

**Flow:**
1. User enters phone number → OTP sent via SMS gateway (Twilio / MSG91).
2. User enters email → OTP sent via email (Django email backend / SendGrid).
3. Both OTPs verified → account created/logged in → JWT issued → role-based redirect (Student/Company/TPO/Super Admin).

## 7. Tech Stack

- **Frontend:** React.js + Tailwind CSS + Axios (API calls) + React Router
- **Backend:** Django + Django REST Framework (DRF)
- **Database:** PostgreSQL
- **Auth:** Custom dual-OTP flow (Twilio for SMS, Django email backend/SendGrid for email) + `djangorestframework-simplejwt` for session tokens
- **File Storage:** Django `FileField` + AWS S3 / Cloudinary (resumes, company logos)
- **Notifications:** Twilio SMS + Email (drive alerts, round results)
- **Hosting:** Vercel/Netlify (React frontend), Render/Railway (Django backend), Supabase/Railway Postgres or AWS RDS (DB)

## 8. Project Folder Structure

```
placement-portal/
│
├── backend/                          # Django project
│   ├── manage.py
│   ├── config/                       # Project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── accounts/                     # Auth + OTP + roles
│   │   ├── models.py                 # User, OTP
│   │   ├── serializers.py
│   │   ├── views.py                  # send-otp, verify-otp, login
│   │   └── urls.py
│   ├── colleges/                     # College onboarding
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── students/                     # Student profiles
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── companies/                    # Company registration & verification
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── drives/                       # Drives, eligibility engine, rounds
│   │   ├── models.py                 # Drive, Round, Application, RoundResult
│   │   ├── serializers.py
│   │   ├── services.py               # eligibility filtering logic
│   │   ├── views.py
│   │   └── urls.py
│   ├── placements/                   # Final placement records + analytics
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── notifications/                # SMS/email dispatch
│       ├── services.py
│       └── tasks.py                  # Celery tasks (optional, async sending)
│
└── frontend/                         # React project
    ├── src/
    │   ├── api/                      # Axios instance + endpoint calls
    │   ├── components/
    │   ├── pages/
    │   │   ├── auth/                 # Phone + Email OTP screens
    │   │   ├── student/              # Profile, drives, status tracker
    │   │   ├── company/               # Post drive, view applicants
    │   │   ├── tpo/                   # Admin dashboard, rounds, results
    │   │   └── superadmin/            # College approval, platform stats
    │   ├── context/                   # Auth context (JWT + role)
    │   └── App.jsx
    └── package.json
```

## 9. Database Schema (Core Models)

- `User` (id, phone, email, role, college_id FK, is_phone_verified, is_email_verified, created_at)
- `OTP` (id, user_id FK, code_hash, type[phone/email], expires_at, is_used)
- `College` (id, name, address, status[pending/approved], approved_by_super_admin)
- `StudentProfile` (user_id FK, branch, cgpa, backlog_count, skills[], resume_url)
- `Company` (id, name, college_id FK, verified_status)
- `Drive` (id, company_id FK, college_id FK, job_title, description, eligibility_criteria(JSON), status)
- `Application` (id, drive_id FK, student_id FK, status, applied_at)
- `Round` (id, drive_id FK, round_type[Aptitude/Technical/HR], order, scheduled_at)
- `RoundResult` (id, round_id FK, student_id FK, status[Pass/Fail/Hold])
- `PlacementRecord` (id, student_id FK, company_id FK, drive_id FK, package_offered, final_status, created_at)

## 10. Core API Endpoints (DRF)

**Auth**
- `POST /api/auth/send-otp/` — send OTP to phone or email
- `POST /api/auth/verify-otp/` — verify OTP, issue JWT
- `POST /api/auth/refresh/` — refresh JWT

**Colleges**
- `POST /api/colleges/apply/` — new college applies to join
- `POST /api/colleges/{id}/approve/` — Super Admin approves (creates TPO account)

**Students**
- `GET/PUT /api/students/profile/`
- `GET /api/students/drives/` — eligible drives for logged-in student
- `GET /api/students/placement-history/`

**Companies**
- `POST /api/companies/register/`
- `POST /api/companies/{id}/verify/` — TPO verifies
- `POST /api/drives/` — company/TPO creates a drive

**Drives & Rounds**
- `GET /api/drives/{id}/eligible-students/` — auto-filtered list
- `POST /api/drives/{id}/rounds/` — create a round
- `POST /api/rounds/{id}/results/` — record pass/fail/hold per student
- `POST /api/drives/{id}/publish-final-list/`

**TPO/Admin Dashboard**
- `GET /api/tpo/dashboard/stats/` — placement %, drives active, students placed
- `GET /api/tpo/placements/export/` — export records as PDF/Excel

## 11. What Makes This Stand Out in Recruitment/Interviews
- Solves a **real, relatable, multi-stakeholder problem** (not a generic CRUD app).
- Demonstrates **role-based access control**, a **rule-based eligibility engine**, and **notification systems** — all valued backend skills.
- **Multi-tenant architecture** (multiple colleges on one platform) shows system design maturity.
- Passwordless dual-OTP auth shows awareness of modern, secure UX patterns.
- Django Admin can double as an internal ops tool during development/demo.
- Easy to demo end-to-end: onboard a college → add a company → post a drive → show auto-filtered students → run rounds → publish results → show placement record.

## 12. MVP Scope (Build This First)
1. Auth (phone + email OTP, 4 roles, JWT).
2. College onboarding + basic TPO dashboard.
3. Student profile creation.
4. Company registration + drive posting.
5. Eligibility engine (simple rule matching on CGPA/branch/backlogs).
6. Application + round tracking (manual status update by TPO is fine for MVP).
7. Final placement record view.

*(Notifications, analytics dashboards, and exports can be Phase 2.)*
