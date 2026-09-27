from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from .models import Drive, Application, Round, RoundResult
from .serializers import DriveSerializer, ApplicationSerializer, RoundSerializer, RoundResultSerializer
from .services import EligibilityEngine
from companies.models import Company
from colleges.models import College
from accounts.models import User
from students.models import StudentProfile
from placements.models import PlacementRecord
from notifications.models import Notification

class DriveListCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        college_id = request.query_params.get('college_id')
        company_id = request.query_params.get('company_id')
        status_filter = request.query_params.get('status')

        qs = Drive.objects.select_related('company', 'college').prefetch_related('rounds', 'applications').order_by('-created_at')

        if college_id:
            qs = qs.filter(college_id=college_id)
        if company_id:
            qs = qs.filter(company_id=company_id)
        if status_filter:
            qs = qs.filter(status=status_filter)

        serializer = DriveSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        
        company_id = data.get('company_id') or data.get('company')
        college_id = data.get('college_id') or data.get('college')

        if not company_id or not college_id:
            return Response({'error': 'Both company and college are required'}, status=status.HTTP_400_BAD_REQUEST)

        company = Company.objects.filter(id=company_id).first()
        college = College.objects.filter(id=college_id).first()

        if not company or not college:
            return Response({'error': 'Invalid company or college specified'}, status=status.HTTP_400_BAD_REQUEST)

        eligibility_criteria = data.get('eligibility_criteria', {})
        if isinstance(eligibility_criteria, str):
            import json
            try:
                eligibility_criteria = json.loads(eligibility_criteria)
            except Exception:
                eligibility_criteria = {}

        drive = Drive.objects.create(
            company=company,
            college=college,
            job_title=data.get('job_title', 'Software Development Engineer'),
            job_role=data.get('job_role', 'Full Stack Developer'),
            job_description=data.get('job_description', ''),
            package_ctc=data.get('package_ctc', '8.5 LPA'),
            package_numeric=float(data.get('package_numeric', 8.5)),
            location=data.get('location', 'Bengaluru / Hybrid'),
            drive_date=data.get('drive_date') or timezone.now().date(),
            deadline=data.get('deadline'),
            eligibility_criteria=eligibility_criteria,
            status=data.get('status', 'open')
        )

        # Create default 3-round standard recruitment pipeline if not customized
        Round.objects.create(drive=drive, name='Round 1: Online Aptitude & Coding Test', round_type='Aptitude', order=1, status='upcoming')
        Round.objects.create(drive=drive, name='Round 2: Technical Interview', round_type='Technical', order=2, status='upcoming')
        Round.objects.create(drive=drive, name='Round 3: HR & Cultural Fit Interview', round_type='HR', order=3, status='upcoming')

        # Auto-create notifications for eligible students
        eligible_students = EligibilityEngine.get_eligible_students_for_drive(drive)
        for s in eligible_students:
            if s.get('is_eligible'):
                u = User.objects.filter(id=s['user_id']).first()
                if u:
                    Notification.objects.create(
                        user=u,
                        title=f"New Drive Alert: {company.name}",
                        message=f"You are eligible for {drive.job_title} at {company.name} ({drive.package_ctc}). Register now!",
                        notification_type='drive_alert',
                        link_url=f"/student/drives/{drive.id}"
                    )

        return Response(DriveSerializer(drive).data, status=status.HTTP_201_CREATED)


class DriveDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        drive = Drive.objects.filter(id=pk).first()
        if not drive:
            return Response({'error': 'Drive not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(DriveSerializer(drive).data)

    def put(self, request, pk):
        drive = Drive.objects.filter(id=pk).first()
        if not drive:
            return Response({'error': 'Drive not found'}, status=status.HTTP_404_NOT_FOUND)

        for field in ['job_title', 'job_role', 'job_description', 'package_ctc', 'package_numeric', 'location', 'drive_date', 'deadline', 'eligibility_criteria', 'status']:
            if field in request.data:
                setattr(drive, field, request.data[field])
        drive.save()
        return Response(DriveSerializer(drive).data)


class DriveEligibleStudentsView(APIView):
    """Auto-filters students based on CGPA, Backlogs, Branch & Skills"""
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        drive = Drive.objects.filter(id=pk).first()
        if not drive:
            return Response({'error': 'Drive not found'}, status=status.HTTP_404_NOT_FOUND)
        
        students = EligibilityEngine.get_eligible_students_for_drive(drive)
        return Response({
            'drive_id': drive.id,
            'drive_title': drive.job_title,
            'company_name': drive.company.name,
            'criteria': drive.eligibility_criteria,
            'total_students_evaluated': len(students),
            'eligible_count': sum(1 for s in students if s['is_eligible']),
            'students': students
        })


class DriveApplyView(APIView):
    """Student applies for a drive"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        drive = Drive.objects.filter(id=pk).first()
        if not drive:
            return Response({'error': 'Drive not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        profile = getattr(user, 'student_profile', None)
        if not profile:
            return Response({'error': 'Please complete your student profile before applying'}, status=status.HTTP_400_BAD_REQUEST)

        # Check eligibility
        is_eligible, reasons = EligibilityEngine.evaluate_student(profile, drive.eligibility_criteria or {})
        if not is_eligible:
            return Response({'error': 'You do not meet the eligibility criteria for this drive.', 'reasons': reasons}, status=status.HTTP_400_BAD_REQUEST)

        app, created = Application.objects.get_or_create(
            drive=drive,
            student=user,
            defaults={'status': 'applied', 'current_round_name': 'Round 1: Screening / Aptitude'}
        )

        # Auto-enroll student into round 1 result pool
        r1 = drive.rounds.filter(order=1).first()
        if r1:
            RoundResult.objects.get_or_create(round=r1, student=user, defaults={'status': 'Hold'})

        return Response({
            'message': 'Successfully applied for the placement drive!',
            'application': ApplicationSerializer(app).data
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class DriveCreateRoundView(APIView):
    """Add a new custom round to drive"""
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        drive = Drive.objects.filter(id=pk).first()
        if not drive:
            return Response({'error': 'Drive not found'}, status=status.HTTP_404_NOT_FOUND)

        order = request.data.get('order', drive.rounds.count() + 1)
        name = request.data.get('name', f"Round {order}: Assessment")
        round_type = request.data.get('round_type', 'Technical')
        location_or_link = request.data.get('location_or_link', 'Virtual')
        instructions = request.data.get('instructions', '')

        round_obj = Round.objects.create(
            drive=drive,
            name=name,
            round_type=round_type,
            order=order,
            location_or_link=location_or_link,
            instructions=instructions,
            status='upcoming'
        )

        return Response(RoundSerializer(round_obj).data, status=status.HTTP_201_CREATED)


class RoundStudentsListView(APIView):
    """List all students currently enrolled in a round and their results"""
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        round_obj = Round.objects.filter(id=pk).first()
        if not round_obj:
            return Response({'error': 'Round not found'}, status=status.HTTP_404_NOT_FOUND)

        # Ensure all registered applicants are in Round 1 or promoted to subsequent rounds
        if round_obj.order == 1:
            for app in round_obj.drive.applications.all():
                RoundResult.objects.get_or_create(round=round_obj, student=app.student, defaults={'status': 'Hold'})

        results = RoundResult.objects.filter(round=round_obj).select_related('student', 'student__student_profile')
        return Response(RoundResultSerializer(results, many=True).data)


class RoundResultsBatchUpdateView(APIView):
    """TPO / Company records Pass / Fail / Hold results for students in a round"""
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        round_obj = Round.objects.filter(id=pk).first()
        if not round_obj:
            return Response({'error': 'Round not found'}, status=status.HTTP_404_NOT_FOUND)

        results_data = request.data.get('results', []) # list of {student_id: 1, status: 'Pass', score: '95', remarks: 'Good'}
        drive = round_obj.drive
        next_round = Round.objects.filter(drive=drive, order=round_obj.order + 1).first()

        updated_count = 0
        for item in results_data:
            student_id = item.get('student_id')
            res_status = item.get('status', 'Hold') # Pass, Fail, Hold
            score = item.get('score', '')
            remarks = item.get('remarks', '')

            student = User.objects.filter(id=student_id).first()
            if not student:
                continue

            res, _ = RoundResult.objects.get_or_create(round=round_obj, student=student)
            res.status = res_status
            if score:
                res.score = score
            if remarks:
                res.remarks = remarks
            res.save()
            updated_count += 1

            # Update student application status
            app = Application.objects.filter(drive=drive, student=student).first()
            if app:
                if res_status == 'Pass':
                    if next_round:
                        app.status = 'in_process'
                        app.current_round_name = next_round.name
                        # Enroll into next round
                        RoundResult.objects.get_or_create(round=next_round, student=student, defaults={'status': 'Hold'})
                    else:
                        app.status = 'selected'
                        app.current_round_name = 'Selected / All Rounds Cleared'
                elif res_status == 'Fail':
                    app.status = 'rejected'
                    app.current_round_name = f'Eliminated in {round_obj.name}'
                app.save()

            # Create notification
            Notification.objects.create(
                user=student,
                title=f"Result Updated: {round_obj.name}",
                message=f"Your result for {round_obj.name} in {drive.job_title} ({drive.company.name}) is: {res_status}.",
                notification_type='round_result'
            )

        round_obj.status = 'completed'
        round_obj.save()

        return Response({
            'message': f"Updated {updated_count} student round records successfully.",
            'round_id': round_obj.id,
            'drive_id': drive.id
        })


class DrivePublishFinalListView(APIView):
    """Publishes final selected students, creates PlacementRecords, and marks students as placed"""
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        drive = Drive.objects.filter(id=pk).first()
        if not drive:
            return Response({'error': 'Drive not found'}, status=status.HTTP_404_NOT_FOUND)

        selected_student_ids = request.data.get('student_ids', [])
        custom_package = request.data.get('package_offered', drive.package_ctc)

        if not selected_student_ids:
            # Auto-pick all students with selected status or passed the last round
            last_round = drive.rounds.order_by('-order').first()
            if last_round:
                selected_student_ids = list(RoundResult.objects.filter(round=last_round, status='Pass').values_list('student_id', flat=True))

        created_records = []
        for s_id in selected_student_ids:
            student = User.objects.filter(id=s_id).first()
            if not student:
                continue

            # Update application status
            app = Application.objects.filter(drive=drive, student=student).first()
            if app:
                app.status = 'selected'
                app.current_round_name = 'Offer Extended'
                app.save()

            # Mark student profile as placed
            if hasattr(student, 'student_profile'):
                student.student_profile.is_placed = True
                student.student_profile.save()

            # Create PlacementRecord
            rec, _ = PlacementRecord.objects.get_or_create(
                student=student,
                company=drive.company,
                drive=drive,
                college=drive.college,
                defaults={
                    'package_offered': custom_package,
                    'package_numeric': drive.package_numeric,
                    'designation': drive.job_role,
                    'final_status': 'Offered'
                }
            )
            created_records.append(rec.id)

            # Send Offer Notification
            Notification.objects.create(
                user=student,
                title=f"🎉 Congratulations! Placement Offer from {drive.company.name}",
                message=f"You have been selected for {drive.job_title} with package {custom_package}!",
                notification_type='offer_alert',
                link_url=f"/student/history"
            )

        drive.status = 'completed'
        drive.save()

        return Response({
            'message': f"Final selection list published! {len(created_records)} placement offers recorded.",
            'drive_id': drive.id,
            'offers_count': len(created_records)
        })
