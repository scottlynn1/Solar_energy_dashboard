from django.urls import path
from . import views

urlpatterns = [
  path("", views.dashboard, name="dashboard"),
  path("solarapi", views.solarapi, name="solarapi"),
  path("save", views.save, name="save"),
]