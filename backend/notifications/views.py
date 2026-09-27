from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')[:30]
        unread_count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({
            'unread_count': unread_count,
            'notifications': NotificationSerializer(notifications, many=True).data
        })

    def post(self, request):
        """Mark all or specific notification as read"""
        notification_id = request.data.get('notification_id')
        if notification_id:
            Notification.objects.filter(id=notification_id, user=request.user).update(is_read=True)
        else:
            Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'Notifications updated.'})
