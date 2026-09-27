from django.contrib import admin
from .models import PlacementRecord

@admin.register(PlacementRecord)
class PlacementRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'company', 'college', 'drive', 'package_offered', 'final_status', 'offer_date')
    list_filter = ('final_status', 'college', 'company')
    search_fields = ('student__full_name', 'company__name', 'drive__job_title')
