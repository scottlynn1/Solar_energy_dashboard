from django.db import models

# Create your models here.
class Voltagedata(models.Model):
  client = models.CharField(max_length=64)
  dc_voltage = models.CharField(max_length=240)