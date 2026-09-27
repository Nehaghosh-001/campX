from django.urls import path
from .views import (
    DriveListCreateView,
    DriveDetailView,
    DriveEligibleStudentsView,
    DriveApplyView,
    DriveCreateRoundView,
    RoundStudentsListView,
    RoundResultsBatchUpdateView,
    DrivePublishFinalListView
)

urlpatterns = [
    path('', DriveListCreateView.as_view(), name='drive_list_create'),
    path('<int:pk>/', DriveDetailView.as_view(), name='drive_detail'),
    path('<int:pk>/eligible-students/', DriveEligibleStudentsView.as_view(), name='drive_eligible_students'),
    path('<int:pk>/apply/', DriveApplyView.as_view(), name='drive_apply'),
    path('<int:pk>/rounds/', DriveCreateRoundView.as_view(), name='drive_create_round'),
    path('rounds/<int:pk>/students/', RoundStudentsListView.as_view(), name='round_students_list'),
    path('rounds/<int:pk>/results/', RoundResultsBatchUpdateView.as_view(), name='round_results_batch_update'),
    path('<int:pk>/publish-final-list/', DrivePublishFinalListView.as_view(), name='drive_publish_final_list'),
]
