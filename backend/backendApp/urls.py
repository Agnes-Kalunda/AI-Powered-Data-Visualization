from django.urls import path, include
from .views import home

urlpatterns = [
    # Other URL patterns
    path('', home, name='home'), 
    path('api/', include('backendApp.api.urls')),
]
