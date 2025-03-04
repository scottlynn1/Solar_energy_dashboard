import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTING_MODULE', 'dynamic_dashboard.settings')
application = get_asgi_application()