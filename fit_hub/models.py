from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class DailyGoal(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  calorie_target = models.IntegerField(default=2200)
  water_target = models.IntegerField(default=2500)  # in ml
  protein_target = models.IntegerField(default=150)  # in grams


class Meal(models.Model):
  MEAL_TYPES = [
      ('breakfast', 'Breakfast'),
      ('lunch', 'Lunch'),
      ('dinner', 'Dinner'),
      ('snack', 'Snack'),
  ]
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  name = models.CharField(max_length=200)
  meal_type = models.CharField(max_length=20, choices=MEAL_TYPES)
  calories = models.IntegerField()
  protein = models.IntegerField(default=0) 
  carbs = models.IntegerField(default=0)  
  fat = models.IntegerField(default=0)  
  date = models.DateField(auto_now_add=True)


class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity = models.CharField(max_length=200)  
    duration_minutes = models.IntegerField()
    calories_burned = models.IntegerField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.activity} ({self.duration_minutes} mins)"