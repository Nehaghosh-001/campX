from rest_framework import serializers
from .models import Drive, Application, Round, RoundResult
from companies.models import Company
from colleges.models import College
from accounts.models import User
from students.models import StudentProfile

class RoundResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    roll_number = serializers.CharField(source='student.student_profile.roll_number', read_only=True)
    branch = serializers.CharField(source='student.student_profile.branch', read_only=True)
    cgpa = serializers.DecimalField(source='student.student_profile.cgpa', max_digits=4, decimal_places=2, read_only=True)

    class Meta:
        model = RoundResult
        fields = [
            'id', 'round', 'student', 'student_name', 'student_email',
            'roll_number', 'branch', 'cgpa', 'status', 'score', 'remarks', 'updated_at'
        ]

class RoundSerializer(serializers.ModelSerializer):
    results_count = serializers.SerializerMethodField()
    passed_count = serializers.SerializerMethodField()

    class Meta:
        model = Round
        fields = [
            'id', 'drive', 'name', 'round_type', 'order', 'scheduled_at',
            'location_or_link', 'instructions', 'status', 'results_count', 'passed_count'
        ]

    def get_results_count(self, obj):
        return obj.results.count()

    def get_passed_count(self, obj):
        return obj.results.filter(status='Pass').count()

class ApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    student_phone = serializers.CharField(source='student.phone', read_only=True)
    roll_number = serializers.CharField(source='student.student_profile.roll_number', read_only=True)
    branch = serializers.CharField(source='student.student_profile.branch', read_only=True)
    cgpa = serializers.DecimalField(source='student.student_profile.cgpa', max_digits=4, decimal_places=2, read_only=True)
    resume_url = serializers.CharField(source='student.student_profile.resume_url', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'drive', 'student', 'student_name', 'student_email', 'student_phone',
            'roll_number', 'branch', 'cgpa', 'resume_url', 'status',
            'current_round_name', 'applied_at', 'notes'
        ]

class DriveSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_logo = serializers.CharField(source='company.logo_url', read_only=True)
    company_industry = serializers.CharField(source='company.industry', read_only=True)
    college_name = serializers.CharField(source='college.name', read_only=True)
    rounds = RoundSerializer(many=True, read_only=True)
    applications_count = serializers.SerializerMethodField()
    selected_count = serializers.SerializerMethodField()

    class Meta:
        model = Drive
        fields = [
            'id', 'company', 'company_name', 'company_logo', 'company_industry',
            'college', 'college_name', 'job_title', 'job_role', 'job_description',
            'package_ctc', 'package_numeric', 'location', 'drive_date', 'deadline',
            'eligibility_criteria', 'status', 'created_at', 'rounds',
            'applications_count', 'selected_count'
        ]

    def get_applications_count(self, obj):
        return obj.applications.count()

    def get_selected_count(self, obj):
        return obj.applications.filter(status='selected').count()
