from django.http import HttpResponseBadRequest
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
        try:
            # Load the dataset file
            df = pd.read_csv(dataset.file.path)

            # Check if there are at least two columns
            if df.shape[1] < 2:
                return HttpResponseBadRequest('Dataset must contain at least two columns.')

            # Convert columns to numeric, forcing errors to NaN
            df = df.apply(pd.to_numeric, errors='coerce')

            # Drop rows with NaN values in the first two columns
            df = df.dropna(subset=[df.columns[0], df.columns[1]])
            
            # if rows are enough for regression
            if df.shape[0] < 2:
                return HttpResponseBadRequest('Not enough valid data points for regression.')

            # Mean of each column
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
        except pd.errors.EmptyDataError:
            return HttpResponseBadRequest('The dataset file is empty.')
        except pd.errors.ParserError:
            return HttpResponseBadRequest('The dataset file is not a valid CSV.')
        except Exception as e:
            return HttpResponseBadRequest(f'An error occurred: {str(e)}')

class DataPointViewSet(viewsets.ModelViewSet):
    queryset = DataPoint.objects.all()
    serializer_class = DataPointSerializer
