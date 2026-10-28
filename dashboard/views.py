from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from datetime import date

from nutrition.models import Meal, DailyGoal
from workouts.models import Workout
from hydration.models import WaterIntake

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_summary(request):
    """Aggregates data from nutrition, workouts, and hydration apps into one endpoint."""
    today = date.today()
    user = request.user

    meals = Meal.objects.filter(user=user, date=today)
    workouts = Workout.objects.filter(user=user, date=today)
    water = WaterIntake.objects.filter(user=user, date=today)
    goal = DailyGoal.objects.filter(user=user).last()

    total_consumed = meals.aggregate(Sum('calories'))['calories__sum'] or 0
    total_burned = workouts.aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0
    total_water = water.aggregate(Sum('amount_ml'))['amount_ml__sum'] or 0
    target_cal = goal.target_calories if goal else 2000

    net_calories = total_consumed - total_burned

    return Response({
        "date": today,
        "calories": {
            "consumed": total_consumed,
            "burned": total_burned,
            "net": net_calories,
            "target": target_cal,
            "remaining": target_cal - net_calories
        },
        "water_ml": {
            "consumed": total_water,
            "target": 3000
        }
    }, status=status.HTTP_200_OK)