from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Avg, Max, Count
from .models import PlacementRecord
from .serializers import PlacementRecordSerializer
from colleges.models import College
from accounts.models import User
from students.models import StudentProfile
from drives.models import Drive

class PlacementRecordListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        college_id = request.query_params.get('college_id')
        company_id = request.query_params.get('company_id')
        branch = request.query_params.get('branch')

        qs = PlacementRecord.objects.select_related('student', 'company', 'college', 'drive').order_by('-created_at')

        if college_id:
            qs = qs.filter(college_id=college_id)
        if company_id:
            qs = qs.filter(company_id=company_id)
        if branch:
            qs = qs.filter(student__student_profile__branch=branch)

        return Response(PlacementRecordSerializer(qs, many=True).data)


class TPODashboardStatsView(APIView):
    """TPO / College Admin Dashboard analytics"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        college_id = request.query_params.get('college_id')
        
        college = None
        if college_id:
            college = College.objects.filter(id=college_id).first()
        if not college:
            college = College.objects.first()

        total_students = User.objects.filter(role='student', college=college).count() if college else User.objects.filter(role='student').count()
        
        placed_qs = PlacementRecord.objects.all()
        if college:
            placed_qs = placed_qs.filter(college=college)

        placed_students_count = placed_qs.values('student').distinct().count()
        placement_percentage = round((placed_students_count / total_students * 100), 1) if total_students > 0 else 0

        drives_qs = Drive.objects.all()
        if college:
            drives_qs = drives_qs.filter(college=college)
        
        active_drives = drives_qs.filter(status__in=['open', 'in_progress']).count()
        completed_drives = drives_qs.filter(status='completed').count()

        avg_package = placed_qs.aggregate(Avg('package_numeric'))['package_numeric__avg'] or 0
        highest_package = placed_qs.aggregate(Max('package_numeric'))['package_numeric__max'] or 0

        # Branch-wise analytics
        branch_stats = []
        for code, label in StudentProfile.BRANCH_CHOICES:
            branch_total = User.objects.filter(role='student', college=college, student_profile__branch=code).count() if college else User.objects.filter(role='student', student_profile__branch=code).count()
            branch_placed = placed_qs.filter(student__student_profile__branch=code).values('student').distinct().count()
            if branch_total > 0:
                branch_stats.append({
                    'branch': code,
                    'branch_name': label,
                    'total': branch_total,
                    'placed': branch_placed,
                    'rate': round((branch_placed / branch_total * 100), 1)
                })

        # Top hiring companies
        top_companies = list(placed_qs.values('company__name').annotate(offers=Count('id')).order_by('-offers')[:5])

        return Response({
            'college_id': college.id if college else None,
            'college_name': college.name if college else 'All Colleges',
            'total_students': total_students,
            'placed_students': placed_students_count,
            'placement_percentage': placement_percentage,
            'active_drives': active_drives,
            'completed_drives': completed_drives,
            'avg_package_lpa': round(float(avg_package), 2),
            'highest_package_lpa': round(float(highest_package), 2),
            'branch_stats': branch_stats,
            'top_companies': top_companies
        })
