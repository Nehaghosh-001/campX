from django.urls import path
from .views import PlacementRecordListView, TPODashboardStatsView

urlpatterns = [
    path('', PlacementRecordListView.as_view(), name='placement_list'),
    path('tpo-stats/', TPODashboardStatsView.as_view(), name='tpo_stats'),
]
