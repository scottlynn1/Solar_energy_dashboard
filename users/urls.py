from django.urls import path
from . import views
from .views import signup_view
app_name = 'users'
urlpatterns = [
  path('', views.index, name='index'),
  path('login', views.login_view, name='login'),
  path('logout', views.logout_view, name='logout'),
  path('signup', signup_view.as_view(), name='signup')
]