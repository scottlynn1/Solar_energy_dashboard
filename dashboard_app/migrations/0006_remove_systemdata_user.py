# Generated by Django 5.1.4 on 2025-02-17 21:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard_app', '0005_systemdata_delete_voltagedata'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='systemdata',
            name='user',
        ),
    ]
