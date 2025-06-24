from django.urls import path
from . import views

urlpatterns = [
    path("ping-ui/", views.IPListView.as_view(), name="ip_list"),
    path("ping-ip/", views.PingView.as_view(), name="ping_ip"),
]
