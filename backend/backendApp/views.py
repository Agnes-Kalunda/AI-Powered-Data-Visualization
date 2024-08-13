from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Dataset, DataPoint
from .serializers import DatasetSerializer, DataPointSerializer
import pandas as pd
from sklearn.linear_model import LinearRegression

class DatasetViewSet(viewsets.ModelViewSet):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    
   
    @action(detail=True, methods=['post'])
    def process_data(self, request, pk=None):
        dataset = self.get_object()
        df = pd.read_csv(dataset.file.path)
        
        # mean of each column
        summary = df.mean().to_dict()
        
        # Linear regression on first two columns
        X = df.iloc[:, 0].values.reshape(-1, 1)
        y = df.iloc[:, 1].values
        model = LinearRegression().fit(X, y)
        
        for _, row in df.iterrows():
            DataPoint.objects.create(dataset=dataset, x=row[0], y=row[1])
        
        return Response({
            'summary': summary,
            'regression_coefficient': model.coef_[0],
            'regression_intercept': model.intercept_
        })

class DataPointViewSet(viewsets.ModelViewSet):
    queryset = DataPoint.objects.all()
    serializer_class = DataPointSerializer