from django.urls import path, include
from .views import WaterLogListCreateView

urlpatterns = [
    path('', WaterLogListCreateView.as_view(), name='hydration-list-create'),
]
