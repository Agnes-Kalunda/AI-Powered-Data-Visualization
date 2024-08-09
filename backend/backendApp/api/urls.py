from django.urls import path
from .views import DataVisualizationAPIView

urlpatterns = [
    path('visualize/', DataVisualizationAPIView.as_view(), name='visualize-data'),
]
