import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings


openai.api_key = settings.OPENAI_API_KEY

class DataVisualizationAPIView(APIView):
    def post(self, request):
        data = request.data.get('data', '')
        prompt = f"Create a visualization suggestion for this data: {data}"

        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=600,
                temperature=0.1
            )
            
            
            suggestion = response.choices[0].message['content']
            
    
            return Response({"suggestion": suggestion}, status=200)
        
        except openai.error.OpenAIError as e:
        
            return Response({"error": str(e)}, status=500)
