from django.db import models
from django.contrib.auth.models import User

class DailyGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='nutrition_daily_goals')
    target_calories = models.IntegerField(default=2000)
    target_protein = models.FloatField(default=150.0)
    target_carbs = models.FloatField(default=250.0)
    target_fat = models.FloatField(default=65.0)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Goal - {self.target_calories} kcal"

class Meal(models.Model):
    MEAL_TYPES = [
        ('BREAKFAST', 'Breakfast'),
        ('LUNCH', 'Lunch'),
        ('DINNER', 'Dinner'),
        ('SNACK', 'Snack'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='nutrition_meals')
    name = models.CharField(max_length=100)
    meal_type = models.CharField(max_length=10, choices=MEAL_TYPES, default='BREAKFAST')
    calories = models.IntegerField()
    protein = models.FloatField(default=0.0)
    carbs = models.FloatField(default=0.0)
    fat = models.FloatField(default=0.0)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.calories} kcal)"