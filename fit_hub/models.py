from django.db import models
from django.contrib.auth.models import User

class DailyGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fit_hub_daily_goals')
    target_calories = models.IntegerField(default=2000)
    target_protein = models.FloatField(default=150.0) 
    target_carbs = models.FloatField(default=250.0)   
    target_fat = models.FloatField(default=65.0)     
    target_water_ml = models.IntegerField(default=3000) 
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

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fit_hub_meals')
    name = models.CharField(max_length=100)
    meal_type = models.CharField(max_length=10, choices=MEAL_TYPES, default='BREAKFAST')
    calories = models.IntegerField()
    protein = models.FloatField(default=0.0)
    carbs = models.FloatField(default=0.0)
    fat = models.FloatField(default=0.0)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.calories} kcal)"

class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fit_hub_workouts')
    title = models.CharField(max_length=100)
    duration_minutes = models.IntegerField()
    calories_burned = models.IntegerField()
    notes = models.TextField(blank=True, null=True)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.calories_burned} kcal burned"

class WaterLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fit_hub_water_logs')
    amount_ml = models.IntegerField(default=250)
    date = models.DateField(auto_now_add=True)

class WeightLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fit_hub_weight_logs')
    weight_kg = models.FloatField()
    date = models.DateField(auto_now_add=True)