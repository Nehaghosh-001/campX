from django.db import models
from django.conf import settings
from colleges.models import College
from companies.models import Company
from drives.models import Drive

class PlacementRecord(models.Model):
    STATUS_CHOICES = (
        ('Offered', 'Offer Extended'),
        ('Accepted', 'Offer Accepted'),
        ('Declined', 'Offer Declined'),
    )

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='placement_records')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='placement_records')
    drive = models.ForeignKey(Drive, on_delete=models.CASCADE, related_name='placement_records')
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='placement_records')
    
    package_offered = models.CharField(max_length=100) # e.g. "14.5 LPA"
    package_numeric = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    designation = models.CharField(max_length=150, default='Software Development Engineer')
    final_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Offered')
    offer_letter_url = models.TextField(blank=True, default='')
    offer_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.full_name} -> {self.company.name} ({self.package_offered})"
