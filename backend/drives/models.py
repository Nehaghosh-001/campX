from django.db import models
from django.conf import settings
from colleges.models import College
from companies.models import Company

class Drive(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('open', 'Open for Registration'),
        ('in_progress', 'Ongoing / In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='drives')
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='drives')
    job_title = models.CharField(max_length=255)
    job_role = models.CharField(max_length=150, default='Software Engineer')
    job_description = models.TextField()
    package_ctc = models.CharField(max_length=100, default='6-8 LPA')
    package_numeric = models.DecimalField(max_digits=10, decimal_places=2, default=6.0) # For analytics (in LPA)
    location = models.CharField(max_length=150, default='Pan India')
    drive_date = models.DateField(null=True, blank=True)
    deadline = models.DateTimeField(null=True, blank=True)
    
    # Eligibility rules: e.g. {"min_cgpa": 7.0, "max_backlogs": 0, "branches": ["CSE", "IT"], "skills": ["Python"]}
    eligibility_criteria = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.job_title} @ {self.company.name} ({self.college.name})"


class Application(models.Model):
    STATUS_CHOICES = (
        ('applied', 'Applied / Registered'),
        ('shortlisted', 'Shortlisted'),
        ('in_process', 'In Assessment Rounds'),
        ('selected', 'Selected / Offered'),
        ('rejected', 'Not Selected'),
    )

    drive = models.ForeignKey(Drive, on_delete=models.CASCADE, related_name='applications')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='applied')
    current_round_name = models.CharField(max_length=100, blank=True, default='Registration')
    applied_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, default='')

    class Meta:
        unique_together = ('drive', 'student')

    def __str__(self):
        return f"{self.student.full_name} -> {self.drive.job_title} ({self.status})"


class Round(models.Model):
    STATUS_CHOICES = (
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    )

    drive = models.ForeignKey(Drive, on_delete=models.CASCADE, related_name='rounds')
    name = models.CharField(max_length=150) # e.g. "Round 1: Online Aptitude & Coding", "Round 2: Technical Interview", "Round 3: HR Interview"
    round_type = models.CharField(max_length=100, default='Technical')
    order = models.IntegerField(default=1)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    location_or_link = models.CharField(max_length=255, blank=True, default='Online Assessment')
    instructions = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.drive.job_title} - {self.name} (#{self.order})"


class RoundResult(models.Model):
    STATUS_CHOICES = (
        ('Pass', 'Qualified / Passed'),
        ('Fail', 'Eliminated / Failed'),
        ('Hold', 'Under Evaluation / On Hold'),
    )

    round = models.ForeignKey(Round, on_delete=models.CASCADE, related_name='results')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='round_results')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Hold')
    score = models.CharField(max_length=50, blank=True, default='')
    remarks = models.TextField(blank=True, default='')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('round', 'student')

    def __str__(self):
        return f"{self.student.full_name} in {self.round.name} : {self.status}"
