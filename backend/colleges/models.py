from django.db import models
from django.conf import settings

class College(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Super Admin Verification'),
        ('approved', 'Verified & Approved'),
        ('rejected', 'Verification Rejected'),
    )

    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    affiliation_number = models.CharField(max_length=100, blank=True, default='', help_text="AICTE / UGC / University Affiliation ID")
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    website = models.URLField(blank=True, default='')
    
    # Verification Document (AICTE/UGC Approval Letter, Govt Recognition Certificate)
    verification_document = models.TextField(blank=True, default='', help_text="Document URL or File path")
    document_name = models.CharField(max_length=255, blank=True, default='AICTE_Approval_Certificate_2026.pdf')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, default='')
    
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_colleges'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.code}) - {self.status}"
