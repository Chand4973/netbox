from django import forms
from ipam.models import Prefix
from netbox.forms import NetBoxModelForm, NetBoxModelFilterSetForm
from utilities.forms.fields import CommentField, DynamicModelChoiceField

from .models import NetpingMonitor


class NetpingMonitorForm(NetBoxModelForm):
    class Meta:
        model = NetpingMonitor
        fields = ("name", "tags")
