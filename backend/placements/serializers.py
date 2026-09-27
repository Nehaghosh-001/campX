from rest_framework import serializers
from .models import PlacementRecord

class PlacementRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    student_phone = serializers.CharField(source='student.phone', read_only=True)
    roll_number = serializers.CharField(source='student.student_profile.roll_number', read_only=True)
    branch = serializers.CharField(source='student.student_profile.branch', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_logo = serializers.CharField(source='company.logo_url', read_only=True)
    college_name = serializers.CharField(source='college.name', read_only=True)
    drive_title = serializers.CharField(source='drive.job_title', read_only=True)

    class Meta:
        model = PlacementRecord
        fields = [
            'id', 'student', 'student_name', 'student_email', 'student_phone',
            'roll_number', 'branch', 'company', 'company_name', 'company_logo',
            'college', 'college_name', 'drive', 'drive_title',
            'package_offered', 'package_numeric', 'designation',
            'final_status', 'offer_letter_url', 'offer_date', 'created_at'
        ]
