from rest_framework import viewsets, permissions
from .models import DailyGoal, Meal, Workout, WaterLog, WeightLog
from .serializers import (
    DailyGoalSerializer,
    MealSerializer,
    WorkoutSerializer,
    WaterLogSerializer,
    WeightLogSerializer,
)

class DailyGoalViewSet(viewsets.ModelViewSet):
    queryset = DailyGoal.objects.all()
    serializer_class = DailyGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DailyGoal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Meal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WaterLogViewSet(viewsets.ModelViewSet):
    queryset = WaterLog.objects.all()
    serializer_class = WaterLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WaterLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WeightLogViewSet(viewsets.ModelViewSet):
    queryset = WeightLog.objects.all()
    serializer_class = WeightLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WeightLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)