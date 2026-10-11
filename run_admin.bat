@echo off
echo ===================================================
echo  Starting CampX Super Admin Control Center
echo ===================================================
cd admin
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
npm run dev
