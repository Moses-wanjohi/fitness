from rest_framework import viewsets, permissions
from .models import WeightLog
from .serializers import WeightLogSerializer

class ProgressViewSet(viewsets.ModelViewSet):
    serializer_class = WeightLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WeightLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)