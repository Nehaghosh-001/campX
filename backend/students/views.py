from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import StudentProfile
from .serializers import StudentProfileSerializer
from accounts.models import User
from drives.models import Drive, Application, Round, RoundResult
from drives.services import EligibilityEngine
from placements.models import PlacementRecord

class StudentProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile, _ = StudentProfile.objects.get_or_create(user=user)
        serializer = StudentProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        profile, _ = StudentProfile.objects.get_or_create(user=user)
        
        # update fields
        for field in ['roll_number', 'branch', 'cgpa', 'backlog_count', 'skills', 'graduation_year', 'resume_url', 'github_url', 'linkedin_url', 'bio']:
            if field in request.data:
                setattr(profile, field, request.data[field])
        
        if 'full_name' in request.data:
            user.full_name = request.data['full_name']
            user.save()

        profile.save()
        return Response(StudentProfileSerializer(profile).data)


class StudentEligibleDrivesView(APIView):
    """Returns all drives available in student's college along with eligibility evaluation reasons"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile, _ = StudentProfile.objects.get_or_create(user=user)
        college = user.college

        if not college:
            # Fallback to first college or all open drives for demo
            drives_qs = Drive.objects.filter(status__in=['open', 'in_progress']).order_by('-created_at')
        else:
            drives_qs = Drive.objects.filter(college=college, status__in=['open', 'in_progress']).order_by('-created_at')

        results = []
        for drive in drives_qs:
            is_eligible, reasons = EligibilityEngine.evaluate_student(profile, drive.eligibility_criteria or {})
            app = Application.objects.filter(drive=drive, student=user).first()
            
            results.append({
                'id': drive.id,
                'company_id': drive.company.id,
                'company_name': drive.company.name,
                'company_logo': drive.company.logo_url,
                'company_industry': drive.company.industry,
                'job_title': drive.job_title,
                'job_role': drive.job_role,
                'job_description': drive.job_description,
                'package_ctc': drive.package_ctc,
                'location': drive.location,
                'deadline': drive.deadline,
                'drive_date': drive.drive_date,
                'eligibility_criteria': drive.eligibility_criteria,
                'status': drive.status,
                'is_eligible': is_eligible,
                'eligibility_reasons': reasons,
                'has_applied': app is not None,
                'application_status': app.status if app else None,
                'current_round': app.current_round_name if app else None
            })

        return Response(results)


class StudentApplicationsTrackerView(APIView):
    """Tracks applied drives, current round progression & interview schedules"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        apps = Application.objects.filter(student=user).select_related('drive', 'drive__company').order_by('-applied_at')
        
        data = []
        for app in apps:
            drive = app.drive
            rounds = Round.objects.filter(drive=drive).order_by('order')
            round_list = []
            for r in rounds:
                res = RoundResult.objects.filter(round=r, student=user).first()
                round_list.append({
                    'id': r.id,
                    'name': r.name,
                    'round_type': r.round_type,
                    'order': r.order,
                    'scheduled_at': r.scheduled_at,
                    'location_or_link': r.location_or_link,
                    'instructions': r.instructions,
                    'status': r.status,
                    'result_status': res.status if res else 'Pending',
                    'remarks': res.remarks if res else ''
                })

            data.append({
                'application_id': app.id,
                'drive_id': drive.id,
                'job_title': drive.job_title,
                'company_name': drive.company.name,
                'company_logo': drive.company.logo_url,
                'package_ctc': drive.package_ctc,
                'applied_at': app.applied_at,
                'status': app.status,
                'current_round_name': app.current_round_name,
                'rounds': round_list
            })
        return Response(data)


class StudentPlacementHistoryView(APIView):
    """Returns final offers and placement records for student"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        records = PlacementRecord.objects.filter(student=user).select_related('company', 'drive', 'college').order_by('-created_at')
        
        data = []
        for rec in records:
            data.append({
                'id': rec.id,
                'company_name': rec.company.name,
                'company_logo': rec.company.logo_url,
                'job_title': rec.drive.job_title,
                'package_offered': rec.package_offered,
                'designation': rec.designation,
                'offer_date': rec.offer_date,
                'final_status': rec.final_status,
                'offer_letter_url': rec.offer_letter_url
            })
        return Response(data)


class CollegeStudentsListView(APIView):
    """TPO endpoint to list/search college students"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        college_id = request.query_params.get('college_id')
        branch = request.query_params.get('branch')
        min_cgpa = request.query_params.get('min_cgpa')
        max_backlogs = request.query_params.get('max_backlogs')

        qs = StudentProfile.objects.select_related('user', 'user__college').all()
        if college_id:
            qs = qs.filter(user__college_id=college_id)
        if branch and branch != 'ALL':
            qs = qs.filter(branch=branch)
        if min_cgpa:
            qs = qs.filter(cgpa__gte=float(min_cgpa))
        if max_backlogs:
            qs = qs.filter(backlog_count__lte=int(max_backlogs))

        serializer = StudentProfileSerializer(qs, many=True)
        return Response(serializer.data)
