from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import DailyGoal, Meal
from .serializers import DailyGoalSerializer, MealSerializer

class DailyGoalViewSet(viewsets.ModelViewSet):
    serializer_class = DailyGoalSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return DailyGoal.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Meal.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)