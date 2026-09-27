from django.db import models
from django.conf import settings

class StudentProfile(models.Model):
    BRANCH_CHOICES = (
        ('CSE', 'Computer Science & Engineering'),
        ('IT', 'Information Technology'),
        ('AI_DS', 'Artificial Intelligence & Data Science'),
        ('ECE', 'Electronics & Communication'),
        ('EE', 'Electrical Engineering'),
        ('MECH', 'Mechanical Engineering'),
        ('CIVIL', 'Civil Engineering'),
        ('OTHER', 'Other Branch'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_profile')
    roll_number = models.CharField(max_length=50, blank=True, default='')
    branch = models.CharField(max_length=50, choices=BRANCH_CHOICES, default='CSE')
    cgpa = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)
    backlog_count = models.IntegerField(default=0)
    skills = models.JSONField(default=list, blank=True)
    graduation_year = models.IntegerField(default=2026)
    resume_url = models.TextField(blank=True, default='')
    github_url = models.URLField(blank=True, default='')
    linkedin_url = models.URLField(blank=True, default='')
    bio = models.TextField(blank=True, default='')
    is_placed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name} ({self.roll_number}) - {self.branch} CGPA: {self.cgpa}"
