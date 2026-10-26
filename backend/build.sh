#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "[1/4] Installing Python requirements..."
pip install --upgrade pip
pip install -r requirements.txt

echo "[2/4] Collecting static files..."
python manage.py collectstatic --no-input

echo "[3/4] Applying database migrations..."
python manage.py migrate --no-input

echo "[4/4] Checking database records..."
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from accounts.models import User
if not User.objects.exists():
    print('[*] Empty database detected on fresh deployment. Seeding demo accounts and colleges...')
    try:
        import seed_data
        seed_data.seed()
        print('[+] Database seeded successfully!')
    except Exception as e:
        print('[-] Seeding notice:', e)
else:
    print('[i] Database already initialized with users. Skipping seed.')
"

echo "=== CampX Build Completed Successfully! ==="
