# Netping_Monitor/plugin.py

from extras.plugins import PluginConfig

class NetpingMonitorConfig(PluginConfig):
    name = 'Netping_Monitor'
    verbose_name = 'NetPing Monitor'
    description = 'Plugin to ping IPs from the UI'
    version = '0.1.0'
    base_url = 'netping-monitor'
    default_settings = {}
 
config = NetpingMonitorConfig
