import uuid
from datetime import timedelta
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from colleges.models import College

class UserManager(BaseUserManager):
    def create_user(self, email, phone, full_name, role='student', college=None, password=None, **extra_fields):
        if not email:
            raise ValueError('Email address is required')
        
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            phone=phone,
            full_name=full_name,
            role=role,
            college=college,
            **extra_fields
        )
        if password:
            user.set_password(password)
        else:
            user.set_password('placement123')
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone, full_name='Super Admin', password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'superadmin')
        return self.create_user(email, phone, full_name, password=password or 'admin123', **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('superadmin', 'Super Admin (Platform Owner)'),
        ('tpo', 'College Admin / TPO'),
        ('company', 'Company Recruiter'),
        ('student', 'Student'),
    )

    phone = models.CharField(max_length=20, blank=True, default='')
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return f"{self.full_name} ({self.role}) - {self.email}"


class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reset_tokens')
    token = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    def create_token_for_user(cls, user, validity_hours=2):
        cls.objects.filter(user=user, is_used=False).update(is_used=True)
        token = str(uuid.uuid4())[:8].upper() # 8-character easy code
        expires_at = timezone.now() + timedelta(hours=validity_hours)
        return cls.objects.create(user=user, token=token, expires_at=expires_at)

    def is_valid(self):
        return not self.is_used and self.expires_at >= timezone.now()
