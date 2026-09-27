from rest_framework import serializers
from .models import Company
from colleges.models import College

class CompanySerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(source='college.name', read_only=True)
    drives_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            'id', 'user', 'college', 'college_name', 'name', 'website',
            'industry', 'description', 'location', 'logo_url',
            'hr_contact_name', 'hr_contact_email', 'hr_contact_phone',
            'verified_status', 'drives_count', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']

    def get_drives_count(self, obj):
        return obj.drives.count()

class CompanyRegisterSerializer(serializers.ModelSerializer):
    hr_email = serializers.EmailField(write_only=True, required=True)
    hr_phone = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Company
        fields = [
            'name', 'website', 'industry', 'description', 'location',
            'logo_url', 'college', 'hr_contact_name', 'hr_email', 'hr_phone'
        ]
