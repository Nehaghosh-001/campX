from django.contrib import admin
from .models import User, PasswordResetToken

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'phone', 'role', 'college', 'is_active', 'created_at')
    list_filter = ('role', 'college')
    search_fields = ('email', 'full_name', 'phone')

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'expires_at', 'is_used', 'created_at')
    list_filter = ('is_used',)
    search_fields = ('user__email', 'token')
