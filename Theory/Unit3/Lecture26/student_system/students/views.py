from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

# This function acts as a view to handle incoming requests
def index(request):
    return HttpResponse("Welcome to the Student Management API (Django)")

from django.http import JsonResponse

def index(request):
    return JsonResponse({
        "message": "Welcome to the Student Management API",
        "version": "1.0",
        "status": "running"
    })
