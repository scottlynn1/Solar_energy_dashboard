# Generated by Django 5.1.4 on 2025-02-17 22:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard_app', '0007_systemdata_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Voltagedata',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('client', models.CharField(max_length=64)),
                ('dc_voltage', models.CharField(max_length=240)),
            ],
        ),
        migrations.DeleteModel(
            name='Systemdata',
        ),
    ]
