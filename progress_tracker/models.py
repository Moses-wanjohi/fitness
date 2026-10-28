from django.db import models
from django.contrib.auth.models import User

class ProgressLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tracker_progress_logs')
    weight_kg = models.FloatField()
    body_fat_percentage = models.FloatField(blank=True, null=True)
    waist_cm = models.FloatField(blank=True, null=True)
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.weight_kg}kg"