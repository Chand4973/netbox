# /opt/netbox/netbox/netbox/plugins/netbox_dynamic_ipam/apps.py
from netbox.plugins import PluginConfig

class NetboxDynamicIpamConfig(PluginConfig):
    name = "netbox.plugins.netbox_dynamic_ipam"
    verbose_name = "Dynamic IPAM"

config = NetboxDynamicIpamConfig
