from rest_framework import generics, permissions
from .models import WaterLog
from .serializers import WaterLogSerializer

class WaterLogListCreateView(generics.ListCreateAPIView):
    serializer_class = WaterLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WaterLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)