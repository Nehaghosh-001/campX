from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Company
from .serializers import CompanySerializer, CompanyRegisterSerializer
from accounts.models import User
from colleges.models import College

class CompanyListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        college_id = request.query_params.get('college_id')
        status_filter = request.query_params.get('status')
        qs = Company.objects.all().order_by('-created_at')

        if college_id:
            qs = qs.filter(college_id=college_id)
        if status_filter:
            qs = qs.filter(verified_status=status_filter)

        serializer = CompanySerializer(qs, many=True)
        return Response(serializer.data)


class CompanyRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CompanyRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        hr_email = data.pop('hr_email')
        hr_phone = data.pop('hr_phone')
        hr_contact_name = data.get('hr_contact_name', data['name'] + ' HR')

        # Create or find user account
        user, _ = User.objects.get_or_create(
            email=hr_email,
            defaults={
                'phone': hr_phone,
                'full_name': hr_contact_name,
                'role': 'company',
                'college': data.get('college')
            }
        )

        company = Company.objects.create(
            user=user,
            hr_contact_email=hr_email,
            hr_contact_phone=hr_phone,
            verified_status='pending',
            **data
        )

        return Response({
            'message': 'Company registration submitted. Pending verification by the College Placement Cell.',
            'company': CompanySerializer(company).data
        }, status=status.HTTP_201_CREATED)


class CompanyVerifyView(APIView):
    """TPO or SuperAdmin verifies or rejects a company"""
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        company = Company.objects.filter(id=pk).first()
        if not company:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action', 'verified') # 'verified' or 'rejected'
        company.verified_status = action
        company.save()

        return Response({
            'message': f"Company '{company.name}' status updated to {company.verified_status}.",
            'company': CompanySerializer(company).data
        })
