# Generated by Django 5.1.4 on 2025-02-17 20:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard_app', '0002_systemdata_delete_voltagedata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='systemdata',
            name='azimuth',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='systemdata',
            name='lat',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='systemdata',
            name='lon',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='systemdata',
            name='losses',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='systemdata',
            name='system_capacity',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='systemdata',
            name='tilt',
            field=models.CharField(max_length=100),
        ),
    ]
