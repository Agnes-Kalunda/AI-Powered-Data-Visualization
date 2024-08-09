from django.http import HttpResponse

def home(request):
    if request.method == 'GET':
        return HttpResponse("Welcome to the homepage!")
    return HttpResponse("Method Not Allowed", status=405)  # Handle other methods
