from rest_framework import generics, permissions
from .models import WeightLog
from .serializers import WeightLogSerializer

class WeightLogListCreateView(generics.ListCreateAPIView):
    serializer_class = WeightLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        
        return WeightLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
    
        serializer.save(user=self.request.user)