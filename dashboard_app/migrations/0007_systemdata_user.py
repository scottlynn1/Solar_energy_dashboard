# Generated by Django 5.1.4 on 2025-02-17 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard_app', '0006_remove_systemdata_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='systemdata',
            name='user',
            field=models.CharField(max_length=64, null=True),
        ),
    ]
