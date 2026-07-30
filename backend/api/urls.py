"""API URL routes — mirrors the old Express /api/* paths exactly."""
from django.urls import path

from . import views

urlpatterns = [
    path("status/", views.api_status),
    path("patients/", views.patient_list),
    path("encounters/", views.encounter_list),
    path("claims/", views.claim_list),
    path("campaigns/", views.campaign_list_create),
    path("campaigns/sync/", views.campaign_sync_sheet),
    path("actions/", views.action_list),
    path("actions/<str:action_id>/", views.action_update),
    path("audit-logs/", views.audit_log_list_create),
    path("dashboard/kpis/", views.dashboard_kpis),
]
