from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
# Create your views here.
@login_required(login_url='/login')
def index(request):
  return HttpResponseRedirect(reverse('dashboard_app:dashboard'))


def login_view(request):
  if request.method == "POST":
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
      login(request, user)
      return HttpResponseRedirect(reverse('dashboard_app:dashboard'))
    else:
      return render(request, 'users/login.html', {
        "message": "invalid credentials"
      })
  else:
    return render(request, "users/login.html")

def logout_view(request):
  logout(request)
  return render(request, "users/login.html", {
    "message": "Logged out."
  })