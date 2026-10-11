@echo off
echo ===================================================
echo  Launching CampX Full Stack Placement System
echo ===================================================
start "CampX Backend API" cmd /k "cd backend && python manage.py runserver 127.0.0.1:8000"
start "CampX React Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"
start "CampX Admin Panel (Port 5174)" cmd /k "run_admin.bat"
echo All servers launched!
echo - Main Portal (Students & College): http://localhost:5173
echo - Master Super Admin Panel:        http://localhost:5174
echo - Backend API:                     http://127.0.0.1:8000/api/
pause
