from rest_framework import serializers
from .models import Workout, Meal, DailyGoal

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = '__all__'

class DailyGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyGoal
        fields = '__all__'