from django.db import models
from django.contrib.auth.models import User

class Dataset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    file = models.FileField(upload_to='datasets/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class DataPoint(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE)
    x = models.FloatField() 
    y = models.FloatField()