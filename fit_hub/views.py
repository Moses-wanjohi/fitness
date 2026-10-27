from rest_framework import viewsets
from .models import Workout, Meal, DailyGoal
from .serializers import WorkoutSerializer, MealSerializer, DailyGoalSerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer

class DailyGoalViewSet(viewsets.ModelViewSet):
    queryset = DailyGoal.objects.all()
    serializer_class = DailyGoalSerializer