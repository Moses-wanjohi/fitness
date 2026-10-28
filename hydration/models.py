from django.db import models
from django.contrib.auth.models import User

class WaterLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hydration_logs')
    amount_ml = models.IntegerField(default=250)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount_ml}ml on {self.date}"