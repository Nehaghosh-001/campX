from django.contrib import admin
from .models import College

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'affiliation_number', 'city', 'state', 'status', 'approved_at', 'created_at')
    list_filter = ('status', 'state', 'city')
    search_fields = ('name', 'code', 'affiliation_number', 'city')
    actions = ['approve_colleges', 'reject_colleges']

    def approve_colleges(self, request, queryset):
        queryset.update(status='approved')
    approve_colleges.short_description = "Approve selected colleges"

    def reject_colleges(self, request, queryset):
        queryset.update(status='rejected')
    reject_colleges.short_description = "Reject selected colleges"
