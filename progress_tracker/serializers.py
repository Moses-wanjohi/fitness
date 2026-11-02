from rest_framework import serializers
from .models import WeightLog

class WeightLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightLog
        fields = ['id', 'weight_kg', 'date', 'notes']
        read_only_fields = ['id', 'date', 'user']