from django.urls import path, include
from .views import HydrationListCreateView

urlpatterns = [
    path('', HydrationListCreateView.as_view(), name='hydration-list'),
]
