from django.shortcuts import render
import os
import requests
import json
from django.http import HttpResponse, HttpResponseRedirect
from .models import Sysdata
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.db.utils import IntegrityError
from django.views import View
from django.utils.decorators import method_decorator
import asyncio
import httpx
import timeit


solar_api_key = os.environ.get('solar_api_key')
# Create your views here.

@login_required(login_url='/login')
def dashboard(request):
  systems = Sysdata.objects.filter(user=request.user.username)
  systemlist = []
  for system in systems:
    systemlist.append(system.system_name)
  return render(request, 'dashboard_app/dashboard.html', {
    'systemlist': systemlist,
    'user': request.user.username,
  })

@method_decorator(login_required, name="dispatch")
class solarapi(View):
  def get(self, request):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    if is_ajax:
      params = {}
      for key in request.GET:
        params[key] = request.GET[key]
      params["api_key"] = solar_api_key
      outputdata = requests.get(
        f"https://developer.nrel.gov/api/pvwatts/v8.json",
        params=params).json()['outputs']
      returndata = {}
      for key in outputdata:
        returndata[key] = outputdata[key]
      return HttpResponse(json.dumps(returndata), content_type="application/json")
    else:
      print('Invalid request')

  def post(self, request):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    if is_ajax:
      data = request.POST
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
      try:
        p.save()
      except IntegrityError:
        return HttpResponse(json.dumps({'response': 'system name already exists'}))
      return HttpResponse(json.dumps({'system': data['system_name']}), content_type="application/json")
    else:
      print('invalid request')


@login_required(login_url='/login')
def retrieve(request):
  is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
  if is_ajax:
    if request.method == 'GET':
      system = Sysdata.objects.get(system_name=request.GET.get('system_name'), user=request.user.username)
      systemdata = {
        'api_key': solar_api_key,
        'system_capacity': system.system_capacity, 
        'module_type': system.module_type, 
        'losses': system.losses, 
        'array_type': system.array_type, 
        'tilt': system.tilt, 
        'azimuth': system.azimuth, 
        'lat': system.lat, 
        'lon': system.lon
      }
      params = dict(systemdata, api_key=f'{solar_api_key}')
      resp = requests.get(
        f"https://developer.nrel.gov/api/pvwatts/v8.json",
        params=params)
      outputdata = resp.json()['outputs']
      returndata = {}
      for key in outputdata:
        returndata[key] = outputdata[key]
      combinedreturndata = {'output': returndata, 'sysdata': systemdata}
      return HttpResponse(json.dumps(combinedreturndata), content_type="application/json")
    elif request.method == "DELETE":
      system_name = request.GET.get('system_name')
      Sysdata.objects.get(system_name=system_name, user=request.user.username).delete()
      return HttpResponse(json.dumps({'response': 'configuration deleted successfully'}), content_type="application/json")
  else:
      print("Invalid request")



@login_required(login_url='/login')
async def optimize(request):
  start = timeit.timeit()
  is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
  if is_ajax:
    if request.method == 'GET':
      params = {}
      for key in request.GET:
        params[key] = request.GET[key]
      ac_annual = int(params['ac_annual'])
      ac_list = {}
      tilt = 0
      params.pop('ac_annual')
      params["api_key"] = solar_api_key
      async with httpx.AsyncClient() as client:
        while tilt < 91:
          params['tilt'] = tilt
          outputdatapending = await client.get(
          f"https://developer.nrel.gov/api/pvwatts/v8.json",
          params=params)
          print(outputdatapending.headers['X-Ratelimit-Remaining'])
          outputdata = outputdatapending.json()
          ac_list[tilt] = outputdata['outputs']['ac_annual']
          tilt = tilt + 1
        res = max(ac_list, key=ac_list.get)
        end = timeit.timeit()
        print(end - start)
        return HttpResponse(json.dumps({'optimal_ac_annual': ac_list[res], 'optimal_tilt': res}))
