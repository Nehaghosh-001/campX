from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    StudentSignupView,
    LoginView,
    ForgotPasswordView,
    ResetPasswordView,
    DemoLoginView,
    CurrentUserView
)

urlpatterns = [
    path('student-signup/', StudentSignupView.as_view(), name='student_signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('demo-login/', DemoLoginView.as_view(), name='demo_login'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh_alt'),
]
