from django.http import HttpResponseBadRequest
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Dataset, DataPoint
from .serializers import DatasetSerializer, DataPointSerializer
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

class DatasetViewSet(viewsets.ModelViewSet):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer

    @action(detail=True, methods=['post'])
    def process_data(self, request, pk=None):
        dataset = self.get_object()
        try:
            # Load the dataset file
            df = pd.read_csv(dataset.file.path)

            # Check if at least four columns
            if df.shape[1] < 4:
                return HttpResponseBadRequest('Dataset must contain at least four columns.')

            # Convert relevant columns to numeric, forcing errors to NaN
            df.iloc[:, 2] = pd.to_numeric(df.iloc[:, 2], errors='coerce')
            df.iloc[:, 3] = pd.to_numeric(df.iloc[:, 3], errors='coerce')

            # Drop rows with NaN values
            df = df.dropna(subset=[df.columns[2], df.columns[3]])

            # Check if enough valid data points for regression
            if df.shape[0] < 2:
                return HttpResponseBadRequest('Not enough valid data points for regression.')

            # Mean of each column 
            summary = df.mean(numeric_only=True).to_dict()

            # Linear regression on the 3rd and 4th columns
            X = df.iloc[:, 2].values.reshape(-1, 1)
            y = df.iloc[:, 3].values
            model = LinearRegression().fit(X, y)

            # Sanitize float values before serialization
            regression_coefficient = np.clip(model.coef_[0], -1e10, 1e10)
            regression_intercept = np.clip(model.intercept_, -1e10, 1e10)

            # Save DataPoint instances using proper indexing
            for _, row in df.iterrows():
                DataPoint.objects.create(dataset=dataset, x=row.iloc[2], y=row.iloc[3])

            return Response({
                'summary': summary,
                'regression_coefficient': regression_coefficient,
                'regression_intercept': regression_intercept
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
