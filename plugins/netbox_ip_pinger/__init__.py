from netbox.plugins import PluginConfig

class IPPingerConfig(PluginConfig):
    name = 'netbox_ip_pinger'
    verbose_name = 'IP Pinger'
    description = 'Ping and monitor IPs from NetBox'
    version = '0.1'
    base_url = 'ip-pinger'

config = IPPingerConfig
