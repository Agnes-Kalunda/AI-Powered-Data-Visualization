from django.contrib import admin
from .models import Dataset, DataPoint

@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ('name', 'uploaded_at') 
    list_filter = ('uploaded_at',)  
    search_fields = ('name',) 

@admin.register(DataPoint)
class DataPointAdmin(admin.ModelAdmin):
    list_display = ('dataset', 'x', 'y')
    list_filter = ('dataset',)
    search_fields = ('dataset__name',)
