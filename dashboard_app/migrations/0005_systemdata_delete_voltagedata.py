# Generated by Django 5.1.4 on 2025-02-17 21:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard_app', '0004_voltagedata_delete_systemdata'),
    ]

    operations = [
        migrations.CreateModel(
            name='Systemdata',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=64)),
                ('system_name', models.CharField(max_length=100)),
                ('system_capacity', models.CharField(max_length=100)),
                ('module_type', models.CharField(max_length=1)),
                ('losses', models.CharField(max_length=100)),
                ('array_type', models.CharField(max_length=1)),
                ('tilt', models.CharField(max_length=100)),
                ('azimuth', models.CharField(max_length=100)),
                ('lat', models.CharField(max_length=100)),
                ('lon', models.CharField(max_length=100)),
            ],
        ),
        migrations.DeleteModel(
            name='Voltagedata',
        ),
    ]
