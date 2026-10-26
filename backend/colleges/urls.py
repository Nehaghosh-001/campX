from django.urls import path
from .views import CollegeListView, CollegeDetailView, CollegeApplyView, CollegeApproveView, PlatformStatsView

urlpatterns = [
    path('', CollegeListView.as_view(), name='college_list'),
    path('<int:pk>/', CollegeDetailView.as_view(), name='college_detail'),
    path('apply/', CollegeApplyView.as_view(), name='college_apply'),
    path('<int:pk>/approve/', CollegeApproveView.as_view(), name='college_approve'),
    path('platform-stats/', PlatformStatsView.as_view(), name='platform_stats'),
    path('platform_stats/', PlatformStatsView.as_view(), name='platform_stats_alias'),
]
