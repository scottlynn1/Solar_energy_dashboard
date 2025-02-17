from django.db import models

# Create your models here.
class Sysdata(models.Model):
  user = models.CharField(max_length=64)
  system_name = models.CharField(max_length=100)
  system_capacity = models.CharField(max_length=100)
  module_type = models.CharField(max_length=100)
  losses = models.CharField(max_length=100)
  array_type = models.CharField(max_length=100)
  tilt = models.CharField(max_length=100)
  azimuth = models.CharField(max_length=100)
  lat = models.CharField(max_length=100)
  lon = models.CharField(max_length=100)