from django.urls import path
from .views import CompanyListView, CompanyRegisterView, CompanyVerifyView

urlpatterns = [
    path('', CompanyListView.as_view(), name='company_list'),
    path('register/', CompanyRegisterView.as_view(), name='company_register'),
    path('<int:pk>/verify/', CompanyVerifyView.as_view(), name='company_verify'),
]
