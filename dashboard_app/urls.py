from django.urls import path
from . import views
from .views import solarapi

app_name="dashboard_app"
urlpatterns = [
  path("", views.dashboard, name="dashboard"),
  path("solarapi", solarapi.as_view(), name="solarapi"),
  path('retrieve', views.retrieve, name='retrieve'),
  path('optimize', views.optimize, name='optimize'),
]