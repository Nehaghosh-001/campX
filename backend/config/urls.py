from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.static import serve

def health_check(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'CampX Placement Management Platform API is running',
        'version': '1.0.0'
    })

urlpatterns = [
    # Health checks
    path('', health_check, name='root_health'),
    path('healthz', health_check, name='healthz'),
    path('api/health/', health_check, name='api_health'),

    # Admin & APIs
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/colleges/', include('colleges.urls')),
    path('api/students/', include('students.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/drives/', include('drives.urls')),
    path('api/placements/', include('placements.urls')),
    path('api/notifications/', include('notifications.urls')),
]

# Media file serving (works in both DEBUG=True and production/Render)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
