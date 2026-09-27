from rest_framework import serializers
from .models import College

class CollegeSerializer(serializers.ModelSerializer):
    student_count = serializers.SerializerMethodField()
    company_count = serializers.SerializerMethodField()
    drive_count = serializers.SerializerMethodField()
    placed_count = serializers.SerializerMethodField()
    tpo_email = serializers.SerializerMethodField()
    tpo_name = serializers.SerializerMethodField()
    tpo_phone = serializers.SerializerMethodField()

    class Meta:
        model = College
        fields = [
            'id', 'name', 'code', 'affiliation_number', 'address', 'city', 'state',
            'contact_email', 'contact_phone', 'website',
            'verification_document', 'document_name', 'status', 'rejection_reason',
            'created_at', 'approved_at',
            'student_count', 'company_count', 'drive_count', 'placed_count',
            'tpo_name', 'tpo_email', 'tpo_phone'
        ]
        read_only_fields = ['id', 'created_at', 'approved_at', 'status', 'rejection_reason']

    def get_student_count(self, obj):
        return obj.users.filter(role='student').count()

    def get_company_count(self, obj):
        return obj.companies.count()

    def get_drive_count(self, obj):
        return obj.drives.count()

    def get_placed_count(self, obj):
        from placements.models import PlacementRecord
        return PlacementRecord.objects.filter(college=obj).values('student').distinct().count()

    def get_tpo_email(self, obj):
        tpo = obj.users.filter(role='tpo').first()
        return tpo.email if tpo else obj.contact_email

    def get_tpo_name(self, obj):
        tpo = obj.users.filter(role='tpo').first()
        return tpo.full_name if tpo else 'TPO Admin'

    def get_tpo_phone(self, obj):
        tpo = obj.users.filter(role='tpo').first()
        return tpo.phone if tpo else obj.contact_phone

class CollegeApplySerializer(serializers.ModelSerializer):
    code = serializers.CharField(required=True)
    admin_name = serializers.CharField(write_only=True, required=True)
    admin_phone = serializers.CharField(write_only=True, required=False, allow_blank=True, default='+91-9876543210')
    admin_email = serializers.EmailField(write_only=True, required=True)
    address = serializers.CharField(required=False, allow_blank=True, default='')
    contact_email = serializers.EmailField(required=False, allow_blank=True, default='')
    contact_phone = serializers.CharField(required=False, allow_blank=True, default='')
    affiliation_number = serializers.CharField(required=False, allow_blank=True, default='')
    website = serializers.CharField(required=False, allow_blank=True, default='')
    verification_document = serializers.CharField(required=False, allow_blank=True, default='')
    document_name = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = College
        fields = [
            'name', 'code', 'affiliation_number', 'address', 'city', 'state',
            'contact_email', 'contact_phone', 'website',
            'verification_document', 'document_name',
            'admin_name', 'admin_phone', 'admin_email'
        ]
