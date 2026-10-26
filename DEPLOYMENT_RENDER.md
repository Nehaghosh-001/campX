# 🚀 Deploying CampX on Render

This guide provides full instructions to deploy the entire **CampX** platform to [Render](https://render.com).

The project consists of three services:
1. **Django Backend API** (Python Web Service)
2. **CampX Main Portal** (React Vite Static Site for Students, TPOs & Recruiters)
3. **Super Admin Control Center** (React Vite Static Site for Master Verification & Platform Admin)

---

## ⚡ Option 1: 1-Click Blueprint Deployment (Recommended)

Render provides **Blueprints** which use the included [`render.yaml`](./render.yaml) to deploy and link all three services with a single click.

### Steps:
1. **Push your code to GitHub / GitLab:**
   ```bash
   git add .
   git commit -m "Configure project for Render deployment"
   git push origin main
   ```

2. **Log into Render:**
   - Go to [dashboard.render.com](https://dashboard.render.com/).

3. **Create New Blueprint:**
   - Click the **New +** button in the top navigation.
   - Select **Blueprint**.
   - Connect your GitHub repository containing the CampX project.
   - Render will parse [`render.yaml`](./render.yaml) and detect:
     - `campx-backend` (Web Service)
     - `campx-frontend` (Static Site)
     - `campx-admin` (Static Site)

4. **Click "Apply":**
   - Render will build and deploy the backend first, then build the two frontends and automatically inject the backend URL into `VITE_API_URL`!
   - On the first build, `build.sh` will automatically run database migrations and seed all pre-configured test accounts and sample data.

---

## 🛠️ Option 2: Manual Step-by-Step Deployment

If you prefer to configure each service manually in the Render Dashboard, follow these steps:

### Step 1: Deploy Backend (Web Service)
1. Go to Render Dashboard -> **New +** -> **Web Service**.
2. Connect your Git repository.
3. Configure the following settings:
   - **Name:** `campx-backend`
   - **Region:** Choose closest to you (e.g., *Singapore*, *Oregon*, *Frankfurt*)
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `bash build.sh`
   - **Start Command:** `gunicorn config.wsgi:application`
   - **Instance Type:** `Free`
4. Expand **Advanced** -> **Health Check Path:** `/api/health/`
5. Under **Environment Variables**, add:
   | Key | Value | Notes |
   |---|---|---|
   | `PYTHON_VERSION` | `3.11.9` | Ensures compatible Python runtime |
   | `SECRET_KEY` | *(Click "Generate" in Render)* | Django cryptographic secret |
   | `DEBUG` | `False` | Disables debug mode in production |
   | `ALLOWED_HOSTS` | `*` | Or your Render backend domain |
   | `CORS_ALLOW_ALL_ORIGINS` | `True` | Allows frontends to communicate with API |
6. Click **Create Web Service**.
7. Once deployed, copy your backend URL (e.g. `https://campx-backend.onrender.com`). Verify it by visiting `https://campx-backend.onrender.com/api/health/` in your browser.

---

### Step 2: Deploy Main Portal (Static Site)
1. In Render Dashboard -> **New +** -> **Static Site**.
2. Connect your Git repository.
3. Configure the settings:
   - **Name:** `campx-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-backend-name.onrender.com/api` |
5. Under **Redirects/Rewrites**:
   - `_redirects` is already included in `frontend/public/_redirects` and copied to `dist/_redirects` automatically on build!
   - *(Optional manual rule in Render)*:
     - **Type:** `Rewrite`
     - **Source:** `/*`
     - **Destination:** `/index.html`
6. Click **Create Static Site**.

---

### Step 3: Deploy Super Admin Panel (Static Site)
1. In Render Dashboard -> **New +** -> **Static Site**.
2. Connect your Git repository.
3. Configure the settings:
   - **Name:** `campx-admin`
   - **Root Directory:** `admin`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-backend-name.onrender.com/api` |
5. Under **Redirects/Rewrites**:
   - `_redirects` is already configured in `admin/public/_redirects` to handle Single Page App routing.
6. Click **Create Static Site**.

---

## 🗄️ Optional: Connecting Render PostgreSQL Database

By default, the backend uses SQLite. If you want a persistent PostgreSQL database on Render:
1. Render Dashboard -> **New +** -> **PostgreSQL**.
2. Name: `campx-db`, Plan: `Free`.
3. Copy the **Internal Database URL** (e.g. `postgres://campx_user:...@dpg-...-a/campx_db`).
4. In your `campx-backend` service -> **Environment** -> Add:
   - `DATABASE_URL` = `<paste your Internal Database URL>`
5. Trigger manual deploy: Render will run `python manage.py migrate` and seed the database automatically!

---

## 🔑 Pre-Configured Test Accounts

Once deployed, you can log in immediately using any of these seeded credentials:

| Role | Login Identifier | Password | Details |
|---|---|---|---|
| **Student (Active)** | `2026-CSE-001` *(or `aarav.sharma@apex.edu`)* | `student123` | Aarav Sharma (CSE, CGPA 9.25, in Google Round 2) |
| **Student (Placed)** | `2026-IT-015` *(or `sneha.patel@apex.edu`)* | `student123` | Sneha Patel (IT, CGPA 8.60, Microsoft 22 LPA Offer) |
| **College TPO** | `tpo.apex@gmail.com` | `tpo123` | Prof. Ramesh Sharma (Apex Institute TPO) |
| **Company Recruiter** | `recruiter@google.com` | `recruiter123` | Marcus Wright (Google Cloud Talent) |
| **Super Admin** | `superadmin@placementcentral.org` *(or `admin@gmail.com`)* | `admin123` *(or `admin@123`)* | Dr. Elena Vance (Platform Super Admin) |

---

## 💡 Notes for Render Free Tier

1. **Free Tier Spindown:**
   - Render's free Web Services spin down after 15 minutes of inactivity.
   - When you access the site after inactivity, the first API request might take **30–50 seconds** to wake up the backend. Subsequent requests will be fast.
2. **Free Static Sites:**
   - Both the main portal and admin panel run on Render's global CDN and are **100% free** with zero spin-down time.
3. **CORS & CSRF:**
   - CORS and CSRF configurations are already set up to accept Render domains (`*.onrender.com`) and custom origins without manual tweaking.
