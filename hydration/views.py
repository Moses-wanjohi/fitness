from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import WaterIntake
from .serializers import WaterIntakeSerializer

class WaterIntakeViewSet(viewsets.ModelViewSet):
    serializer_class = WaterIntakeSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return WaterIntake.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)