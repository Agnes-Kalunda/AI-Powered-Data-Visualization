from rest_framework import serializers
from .models import Dataset, DataPoint

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ['id', 'name', 'file', 'uploaded_at']

class DataPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataPoint
        fields = ['id', 'dataset', 'x', 'y']