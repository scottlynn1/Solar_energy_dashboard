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

        data = requests.get(f"https://developer.nrel.gov/api/pvwatts/v8.json?api_key={solar_api_key}&azimuth=180&system_capacity=4&losses=14&array_type=1&module_type=0&gcr=0.4&dc_ac_ratio=1.2&inv_eff=96.0&radius=0&dataset=nsrdb&tilt=10&address=boulder, co&soiling=12|4|45|23|9|99|67|12.54|54|9|0|7.6&albedo=0.3&bifaciality=0.7")

  #params={"q": "language:python", "sort": "stars", "order": "desc"})
        return HttpResponse(json.dumps(data.json()), content_type="application/json")
  else:
    print('Invalid request')
  #return data.json()