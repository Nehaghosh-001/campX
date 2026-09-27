from django.urls import path
from .views import (
    StudentProfileView,
    StudentEligibleDrivesView,
    StudentApplicationsTrackerView,
    StudentPlacementHistoryView,
    CollegeStudentsListView
)

urlpatterns = [
    path('profile/', StudentProfileView.as_view(), name='student_profile'),
    path('drives/', StudentEligibleDrivesView.as_view(), name='student_drives'),
    path('applications/', StudentApplicationsTrackerView.as_view(), name='student_applications'),
    path('placement-history/', StudentPlacementHistoryView.as_view(), name='student_placement_history'),
    path('list/', CollegeStudentsListView.as_view(), name='college_students_list'),
]
