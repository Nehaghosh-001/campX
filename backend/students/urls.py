from django.urls import path
from .views import (
    StudentProfileView,
    StudentEligibleDrivesView,
    StudentApplicationsTrackerView,
    StudentPlacementHistoryView,
    CollegeStudentsListView,
    StudentDetailView
)

urlpatterns = [
    path('', CollegeStudentsListView.as_view(), name='college_students_root'),
    path('<int:pk>/', StudentDetailView.as_view(), name='student_detail'),
    path('profile/', StudentProfileView.as_view(), name='student_profile'),
    path('drives/', StudentEligibleDrivesView.as_view(), name='student_drives'),
    path('applications/', StudentApplicationsTrackerView.as_view(), name='student_applications'),
    path('placement-history/', StudentPlacementHistoryView.as_view(), name='student_placement_history'),
    path('list/', CollegeStudentsListView.as_view(), name='college_students_list'),
]
