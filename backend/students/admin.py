from django.contrib import admin
from .models import StudentProfile

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'roll_number', 'branch', 'cgpa', 'backlog_count', 'is_placed', 'graduation_year')
    list_filter = ('branch', 'is_placed', 'graduation_year')
    search_fields = ('user__full_name', 'user__email', 'roll_number')
