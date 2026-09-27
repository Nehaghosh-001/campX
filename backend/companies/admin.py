from django.contrib import admin
from .models import Company

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'college', 'industry', 'verified_status', 'hr_contact_name', 'hr_contact_email', 'created_at')
    list_filter = ('verified_status', 'industry', 'college')
    search_fields = ('name', 'hr_contact_name', 'hr_contact_email')
