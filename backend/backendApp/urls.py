
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DatasetViewSet, DataPointViewSet

router = DefaultRouter()
router.register(r'datasets', DatasetViewSet)
router.register(r'datapoints', DataPointViewSet)

urlpatterns = [
    path('', include(router.urls)),
]


