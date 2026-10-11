@echo off
echo ==============================================
echo  Starting CampX Django REST API Server
echo ==============================================
cd backend
python manage.py runserver 127.0.0.1:8000
pause
