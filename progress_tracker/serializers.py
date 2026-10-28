from rest_framework import serializers
from .models import ProgressLog

class ProgressLogSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = ProgressLog
        fields = '__all__'