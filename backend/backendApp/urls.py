from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import DatasetViewSet, DataPointViewSet

router = DefaultRouter()
router.register(r'datasets', DatasetViewSet)
router.register(r'datapoints', DataPointViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


