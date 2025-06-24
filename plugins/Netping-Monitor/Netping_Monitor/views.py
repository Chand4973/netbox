from django.db.models import Count
from netbox.views import generic
from . import filtersets, forms, models, tables

# Existing CRUD views for NetpingMonitor
class NetpingMonitorView(generic.ObjectView):
    queryset = models.NetpingMonitor.objects.all()

class NetpingMonitorListView(generic.ObjectListView):
    queryset = models.NetpingMonitor.objects.all()
    table = tables.NetpingMonitorTable

class NetpingMonitorEditView(generic.ObjectEditView):
    queryset = models.NetpingMonitor.objects.all()
    form = forms.NetpingMonitorForm

class NetpingMonitorDeleteView(generic.ObjectDeleteView):
    queryset = models.NetpingMonitor.objects.all()


from django.views import View
from django.shortcuts import render
from django.http import JsonResponse
import subprocess

class IPListView(View):
    def get(self, request):
        # You can later dynamically load from model — hardcoded for now
        ip_list = ['8.8.8.8', '1.1.1.1']
        return render(request, 'Netping_Monitor/ip_list.html', {'ip_list': ip_list})

class PingView(View):
    def post(self, request):
        ip = request.POST.get("ip")
        if not ip:
            return JsonResponse({"error": "No IP provided"}, status=400)

        try:
            result = subprocess.run(
                ["ping", "-c", "1", ip],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            return JsonResponse({
                "ip": ip,
                "status": "success" if result.returncode == 0 else "fail",
                "output": result.stdout
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
