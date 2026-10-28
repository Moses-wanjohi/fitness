from django.urls import path
from .views import WeightLogListCreateView

urlpatterns = [
    path('', WeightLogListCreateView.as_view(), name='weight-logs'),
]