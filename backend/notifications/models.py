from django.db import models
from django.conf import settings

class Notification(models.Model):
    TYPE_CHOICES = (
        ('drive_alert', 'New Drive / Eligibility Match'),
        ('round_schedule', 'Round Schedule Updated'),
        ('round_result', 'Round Result Published'),
        ('offer_alert', 'Placement Offer'),
        ('general', 'General Notice'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='general')
    link_url = models.CharField(max_length=255, blank=True, default='')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"To: {self.user.full_name} | {self.title}"
