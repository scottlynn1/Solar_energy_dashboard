from django.shortcuts import render
import os
import requests
import json
from django.http import HttpResponse, HttpResponseRedirect
from .models import Sysdata
from django.urls import reverse
from django.contrib.auth.decorators import login_required
solar_api_key = os.environ.get('solar_api_key')
# Create your views here.

@login_required(login_url='/login')
def dashboard(request):
  systems = Sysdata.objects.filter(user=request.user.username)
  systemlist = []
  for system in systems:
    systemlist.append(system.system_name)
  return render(request, 'dashboard_app/dashboard.html', {
    'systemlist': systemlist
  })

@login_required(login_url='/login')
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

@login_required(login_url='/login')
def save(request):
  data = json.loads(request.body)
  p = Sysdata(
    user = request.user.username,
    system_name = data['system_name'],
    system_capacity = data['system_capacity'],
    module_type = data['module_type'],
    losses = data['losses'],
    array_type = data['array_type'],
    tilt = data['tilt'],
    azimuth = data['azimuth'],
    lat = data['lat'],
    lon = data['lon']
  )
  p.save()
  return HttpResponse(json.dumps({'res': 'success'}), content_type="application/json")

