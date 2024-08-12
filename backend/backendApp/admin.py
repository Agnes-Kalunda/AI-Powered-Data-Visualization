from django.contrib import admin
from .models import Dataset, DataPoint

@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'uploaded_at')
    list_filter = ('user', 'uploaded_at')
    search_fields = ('name', 'user__username')

@admin.register(DataPoint)
class DataPointAdmin(admin.ModelAdmin):
    list_display = ('dataset', 'x', 'y')
    list_filter = ('dataset',)
    search_fields = ('dataset__name',)