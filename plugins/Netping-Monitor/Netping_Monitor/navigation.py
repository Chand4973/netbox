from netbox.plugins import PluginMenuButton, PluginMenuItem as NetboxPluginMenuItem
from extras.plugins import PluginMenuItem  # for older NetBox versions

# "Add" button for Netping Monitor List page
plugin_buttons = [
    PluginMenuButton(
        link="plugins:Netping_Monitor:netpingmonitor_add",
        title="Add",
        icon_class="mdi mdi-plus-thick",
    )
]

# Main menu item for model-based views
menu_items = (
    NetboxPluginMenuItem(
        link="plugins:Netping_Monitor:netpingmonitor_list",
        link_text="Netping Monitor",
        buttons=plugin_buttons,
    ),
)

# Separate menu item for Ping UI view
plugin_menu_items = [
    PluginMenuItem(link='plugins:Netping_Monitor:ip_list', link_text='Ping IPs'),
]

