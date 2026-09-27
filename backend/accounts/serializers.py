from rest_framework import serializers
from .models import User, PasswordResetToken
from colleges.models import College
from students.models import StudentProfile
from companies.models import Company

class CollegeSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name', 'code', 'city', 'state', 'status']

class StudentProfileSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['id', 'roll_number', 'branch', 'cgpa', 'backlog_count', 'skills', 'graduation_year', 'resume_url', 'github_url', 'linkedin_url', 'bio', 'is_placed']

class CompanySimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'website', 'industry', 'description', 'location', 'logo_url', 'verified_status']

class UserSerializer(serializers.ModelSerializer):
    college = CollegeSimpleSerializer(read_only=True)
    college_id = serializers.PrimaryKeyRelatedField(
        queryset=College.objects.all(), source='college', write_only=True, required=False, allow_null=True
    )
    student_profile = StudentProfileSimpleSerializer(read_only=True)
    company_profile = CompanySimpleSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'phone', 'email', 'full_name', 'role',
            'college', 'college_id',
            'student_profile', 'company_profile', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class StudentSignupSerializer(serializers.Serializer):
    college_id = serializers.IntegerField(required=True)
    full_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    roll_number = serializers.CharField(required=True)
    branch = serializers.CharField(required=False, default='CSE')
    password = serializers.CharField(required=True, min_length=6)


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True) # roll number or email
    password = serializers.CharField(required=True)


class ForgotPasswordSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True) # email or roll number


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)
