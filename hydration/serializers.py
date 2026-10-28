from rest_framework import serializers
from .models import WaterIntake

class WaterIntakeSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = WaterIntake
        fields = '__all__'