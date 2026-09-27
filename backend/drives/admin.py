from django.contrib import admin
from .models import Drive, Round, Application, RoundResult

@admin.register(Drive)
class DriveAdmin(admin.ModelAdmin):
    list_display = ('job_title', 'company', 'college', 'package_ctc', 'status', 'drive_date', 'deadline')
    list_filter = ('status', 'college', 'company')
    search_fields = ('job_title', 'company__name', 'college__name')

@admin.register(Round)
class RoundAdmin(admin.ModelAdmin):
    list_display = ('drive', 'name', 'round_type', 'order', 'status', 'scheduled_at')
    list_filter = ('round_type', 'status')

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('student', 'drive', 'status', 'current_round_name', 'applied_at')
    list_filter = ('status', 'drive')
    search_fields = ('student__full_name', 'student__email', 'drive__job_title')

@admin.register(RoundResult)
class RoundResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'round', 'status', 'score', 'updated_at')
    list_filter = ('status',)
