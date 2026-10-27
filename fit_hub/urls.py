from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import WorkoutViewSet, MealViewSet, DailyGoalViewSet

router = DefaultRouter()
router.register(r'workouts', WorkoutViewSet, basename='workout')
router.register(r'meals', MealViewSet)
router.register(r'daily-goals', DailyGoalViewSet)


urlpatterns = [
    path('', include(router.urls)),
]