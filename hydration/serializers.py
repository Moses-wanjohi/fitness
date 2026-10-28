from rest_framework import serializers
from .models import WaterLog

class WaterLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterLog
        fields = '__all__'
        read_only_fields = ['user', 'date']