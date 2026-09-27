from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from .models import College
from .serializers import CollegeSerializer, CollegeApplySerializer
from accounts.models import User
from students.models import StudentProfile
from companies.models import Company
from drives.models import Drive
from placements.models import PlacementRecord
from notifications.models import Notification

class CollegeListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        status_filter = request.query_params.get('status')
        qs = College.objects.all().order_by('-created_at')
        if status_filter:
            qs = qs.filter(status=status_filter)
        serializer = CollegeSerializer(qs, many=True)
        return Response(serializer.data)


class CollegeApplyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CollegeApplySerializer(data=request.data)
        if not serializer.is_valid():
            first_err = list(serializer.errors.values())[0]
            err_msg = first_err[0] if isinstance(first_err, list) else str(first_err)
            return Response({'error': err_msg}, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        admin_name = data.pop('admin_name', 'TPO Admin')
        admin_phone = data.pop('admin_phone', '+91-9876543210')
        admin_email = data.pop('admin_email')
        college_code = data.get('code', '').strip().upper()
        data['code'] = college_code

        # Default values if missing
        if not data.get('address'):
            data['address'] = f"Campus Institutional Area, {data.get('city', '')}, {data.get('state', '')}".strip(', ')
        if not data.get('contact_email'):
            data['contact_email'] = admin_email
        if not data.get('contact_phone'):
            data['contact_phone'] = admin_phone
        if not data.get('verification_document'):
            data['verification_document'] = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        if not data.get('document_name'):
            data['document_name'] = f"{college_code}_AICTE_UGC_Approval_Letter.pdf"

        # Check if code already exists
        existing_college = College.objects.filter(code__iexact=college_code).first()
        if existing_college:
            if existing_college.status == 'approved':
                return Response({
                    'error': f"A verified institution with code '{college_code}' is already approved. You can log in directly using your TPO credentials."
                }, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Update existing pending or rejected college record
                for k, v in data.items():
                    setattr(existing_college, k, v)
                existing_college.status = 'pending'
                existing_college.rejection_reason = ''
                existing_college.save()
                college = existing_college
        else:
            college = College.objects.create(status='pending', **data)

        # Create or update corresponding TPO user
        tpo_user = User.objects.filter(email__iexact=admin_email).first()
        if not tpo_user:
            tpo_user = User.objects.create_user(
                email=admin_email,
                password='tpo123',
                phone=admin_phone,
                full_name=admin_name,
                role='tpo',
                college=college
            )
        else:
            tpo_user.college = college
            tpo_user.role = 'tpo'
            tpo_user.full_name = admin_name
            tpo_user.phone = admin_phone
            tpo_user.save()

        # Send in-app notification to Super Admin
        superadmins = User.objects.filter(role='superadmin')
        for sa in superadmins:
            Notification.objects.create(
                user=sa,
                title=f"New College Verification Request: {college.name}",
                message=f"{college.name} ({college.code}) submitted AICTE/UGC accreditation document for verification.",
                notification_type="general",
                link_url="/superadmin"
            )

        return Response({
            'message': f"College onboarding request for '{college.name}' ({college.code}) submitted successfully! AICTE verification document is now available for Super Admin audit.",
            'college': CollegeSerializer(college).data
        }, status=status.HTTP_201_CREATED)


class CollegeApproveView(APIView):
    """Super Admin reviews, approves or rejects college document verification"""
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        college = College.objects.filter(id=pk).first()
        if not college:
            return Response({'error': 'College not found'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action', 'approve') # 'approve' or 'reject'
        reason = request.data.get('reason', '')

        if action == 'approve':
            college.status = 'approved'
            college.approved_at = timezone.now()
            college.rejection_reason = ''
            college.save()

            # Ensure TPO user exists and is active
            tpo_user = User.objects.filter(college=college, role='tpo').first()
            if not tpo_user:
                tpo_user = User.objects.create_user(
                    email=college.contact_email,
                    password='tpo123',
                    phone=college.contact_phone,
                    full_name=f"{college.name} TPO",
                    role='tpo',
                    college=college
                )

            # Send Notification to TPO
            Notification.objects.create(
                user=tpo_user,
                title="🎉 College Verification Approved!",
                message=f"Your institution '{college.name}' has been verified by the Super Admin. Full Placement Cell Admin Dashboard is now active!",
                notification_type="general",
                link_url="/tpo"
            )

            return Response({
                'message': f"College '{college.name}' has been verified and approved! Placement Admin Dashboard access granted.",
                'college': CollegeSerializer(college).data
            })
        else:
            college.status = 'rejected'
            college.rejection_reason = reason or 'Verification documents did not meet accreditation criteria or were illegible.'
            college.save()

            # Notify TPO
            tpo_user = User.objects.filter(college=college, role='tpo').first()
            if tpo_user:
                Notification.objects.create(
                    user=tpo_user,
                    title="⚠️ College Verification Update",
                    message=f"Verification for '{college.name}' was not approved. Reason: {college.rejection_reason}",
                    notification_type="general",
                    link_url="/auth"
                )

            return Response({
                'message': f"College '{college.name}' application marked as rejected.",
                'college': CollegeSerializer(college).data
            })


class PlatformStatsView(APIView):
    """Platform-wide analytics for Super Admin"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        total_colleges = College.objects.count()
        approved_colleges = College.objects.filter(status='approved').count()
        pending_colleges = College.objects.filter(status='pending').count()
        rejected_colleges = College.objects.filter(status='rejected').count()
        total_students = User.objects.filter(role='student').count()
        total_companies = Company.objects.count()
        total_drives = Drive.objects.count()
        total_placements = PlacementRecord.objects.count()

        branch_distribution = {}
        for branch, name in StudentProfile.BRANCH_CHOICES:
            count = PlacementRecord.objects.filter(student__student_profile__branch=branch).values('student').distinct().count()
            branch_distribution[branch] = count

        return Response({
            'total_colleges': total_colleges,
            'approved_colleges': approved_colleges,
            'pending_colleges': pending_colleges,
            'rejected_colleges': rejected_colleges,
            'total_students': total_students,
            'total_companies': total_companies,
            'total_drives': total_drives,
            'total_placements': total_placements,
            'branch_distribution': branch_distribution,
        })
