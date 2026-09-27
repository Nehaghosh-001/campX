@echo off
echo ==============================================
echo  Starting CampusOrbit Django REST API Server
echo ==============================================
cd backend
python manage.py runserver 127.0.0.1:8000
pause
