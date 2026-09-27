from django.db import models
from django.conf import settings
from colleges.models import College

class Company(models.Model):
    VERIFIED_STATUS = (
        ('pending', 'Pending Verification'),
        ('verified', 'Verified & Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='company_profile')
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True, related_name='companies')
    name = models.CharField(max_length=255)
    website = models.URLField(blank=True, default='')
    industry = models.CharField(max_length=100, default='Information Technology')
    description = models.TextField(blank=True, default='')
    location = models.CharField(max_length=150, default='Multiple Locations')
    logo_url = models.TextField(blank=True, default='')
    hr_contact_name = models.CharField(max_length=150, blank=True, default='')
    hr_contact_email = models.EmailField(blank=True, default='')
    hr_contact_phone = models.CharField(max_length=20, blank=True, default='')
    verified_status = models.CharField(max_length=20, choices=VERIFIED_STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.verified_status})"
