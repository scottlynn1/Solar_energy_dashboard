from django.urls import path
from . import views


app_name="dashboard_app"
urlpatterns = [
  path("", views.dashboard, name="dashboard"),
  path("solarapi", views.solarapi, name="solarapi"),
  path("save", views.save, name="save"),
]