from django.shortcuts import render
import os
import requests
import json
from django.http import HttpResponse

solar_api_key = os.environ.get('solar_api_key')
# Create your views here.
def dashboard(request):
  return render(request, 'dashboard_app/dashboard.html')

def solarapi(request):
  is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

  if is_ajax:
      if request.method == 'GET':
        data = requests.get(
          f"https://developer.nrel.gov/api/pvwatts/v8.json",
          params={
            "api_key": f"{solar_api_key}",
            "system_capacity": request.GET.get('system_capacity'),
            "module_type": request.GET.get('module_type'),
            "losses": request.GET.get('losses'),
            "array_type": request.GET.get('array_type'),
            "tilt": request.GET.get('tilt'),
            "azimuth": request.GET.get('azimuth'),
            "lat": request.GET.get('lat'),
            "lon": request.GET.get('lon')
        })
        return HttpResponse(json.dumps(data.json()), content_type="application/json")
  else:
    print('Invalid request')
