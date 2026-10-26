#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "=== Running CampX Build from Root ==="
pip install --upgrade pip
pip install -r requirements.txt

cd backend
python manage.py collectstatic --no-input
python manage.py migrate --no-input

python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from accounts.models import User
if not User.objects.exists():
    print('[*] Empty database detected. Seeding demo accounts and colleges...')
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
