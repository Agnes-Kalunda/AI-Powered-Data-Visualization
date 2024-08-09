import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import logging

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

openai.api_key = settings.OPENAI_API_KEY

class DataVisualizationAPIView(APIView):
    def post(self, request):

        data = request.data.get('data', '')
        
        if not data:
            logger.error("No data provided in the request")
            return Response({"error": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)
        
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
            
        
            suggestion = response.choices[0].message['content'].strip()
            
            
            if not suggestion:
                logger.warning("Received an empty suggestion from OpenAI")
                return Response({"suggestion": "No suggestion generated"}, status=status.HTTP_204_NO_CONTENT)
            
        
            return Response({"suggestion": suggestion}, status=status.HTTP_200_OK)
        
        except openai.error.OpenAIError as e:
            # detailed logging
            logger.error(f"OpenAI API error: {e}")
            return Response({"error": "An error occurred while processing your request"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except Exception as e:
            #unexpected errors
            logger.error(f"Unexpected error: {e}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
