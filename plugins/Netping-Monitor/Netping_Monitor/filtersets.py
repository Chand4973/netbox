from netbox.filtersets import NetBoxModelFilterSet
from .models import NetpingMonitor


# class NetpingMonitorFilterSet(NetBoxModelFilterSet):
#
#     class Meta:
#         model = NetpingMonitor
#         fields = ['name', ]
#
#     def search(self, queryset, name, value):
#         return queryset.filter(description__icontains=value)
