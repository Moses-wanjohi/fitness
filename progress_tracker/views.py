from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ProgressLog
from .serializers import ProgressLogSerializer

class ProgressLogViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressLogSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return ProgressLog.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)