from rest_framework import serializers
from .models import DailyGoal, Meal

class DailyGoalSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = DailyGoal
        fields = '__all__'

class MealSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Meal
        fields = '__all__'