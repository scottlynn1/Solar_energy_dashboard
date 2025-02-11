from django.shortcuts import render
import os
import requests
import json
from django.http import HttpResponse
from .models import Voltagedata

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
        }).json()
        poa_monthly = data['outputs']['poa_monthly']
        dc_monthly = data['outputs']['dc_monthly']
        ac_monthly = data['outputs']['ac_monthly']
        solrad_monthly = data['outputs']['solrad_monthly']
        solrad_annual = data['outputs']['solrad_annual']
        ac_annual = data['outputs']['ac_annual']
        capacity_factor = data['outputs']['capacity_factor']
        info = {'poa_monthly': poa_monthly, 'dc_monthly': dc_monthly, 'ac_monthly': ac_monthly, 'solrad_monthly': solrad_monthly, 'solrad_annual': solrad_annual, 'ac_annual': ac_annual, 'capacity_factor': capacity_factor}
        print(info)
        return HttpResponse(json.dumps(info), content_type="application/json")
  else:
    print('Invalid request')

def save(request):
  data = json.loads(request.body)
  print(data)
  p = Voltagedata(client = data['client'], dc_voltage = data['data'])
  p.save()
  return HttpResponse(json.dumps({'res': 'success'}), content_type="application/json")

