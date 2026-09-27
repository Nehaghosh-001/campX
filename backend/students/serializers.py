from rest_framework import serializers
from .models import StudentProfile
from accounts.models import User
from colleges.models import College

class StudentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'phone', 'full_name', 'college']

class StudentProfileSerializer(serializers.ModelSerializer):
    user = StudentUserSerializer(read_only=True)
    college_name = serializers.CharField(source='user.college.name', read_only=True)

    class Meta:
        model = StudentProfile
        fields = [
            'id', 'user', 'college_name', 'roll_number', 'branch', 'cgpa',
            'backlog_count', 'skills', 'graduation_year', 'resume_url',
            'github_url', 'linkedin_url', 'bio', 'is_placed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
